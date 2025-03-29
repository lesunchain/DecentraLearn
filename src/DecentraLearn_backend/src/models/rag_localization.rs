use gemini_rs;
use std::collections::HashMap;
use std::fs::File;
use std::io::{Write, BufWriter};
use anyhow::{Result, Context};
use lopdf::{Document, Object};
use regex::Regex;

struct RAGSystem {
    document_store: HashMap<String, String>,
}

impl RAGSystem {
    pub fn new() -> Self {
        Self {
            document_store: HashMap::new(),
        }
    }

    pub fn add_document(&mut self, doc_id: &str, content: &str) {
        self.document_store.insert(doc_id.to_string(), content.to_string());
    }

    pub fn add_pdf_document(&mut self, pdf_path: &str, output_path: &str) -> Result<()> {
        let doc = Document::load(pdf_path).context("Failed to load PDF document")?;
        let mut content = String::new();

        for object_id in doc.get_pages().values() {
            if let Ok(Object::Dictionary(dict)) = doc.get_object(*object_id) {
                if let Ok(Object::Array(streams)) = dict.get(b"Contents") {
                    for stream in streams {
                        if let Object::Reference(stream_id) = stream {
                            if let Ok(Object::Stream(stream)) = doc.get_object(stream_id) {
                                if let Ok(decoded) = stream.decompressed_content() {
                                    let extracted_text = String::from_utf8_lossy(&decoded).to_string();
                                    println!("Extracted text segment: {}", extracted_text); // Debug print
                                    content.push_str(&extracted_text);
                                } else {
                                    eprintln!("Failed to decompress stream content.");
                                }
                            } else {
                                eprintln!("Failed to retrieve referenced stream.");
                            }
                        }
                    }
                } else {
                    eprintln!("No Contents field found for object {:?}", object_id);
                }
            } else {
                eprintln!("Failed to get dictionary for object {:?}", object_id);
            }
        }

        // Save cleaned text
        let re = Regex::new(r"\s+").unwrap();
        let cleaned_content = re.replace_all(&content, " ").to_string();

        if cleaned_content.is_empty() {
            eprintln!("Warning: Extracted content is empty.");
        } else {
            println!("Extracted Content saved to {}", output_path);
        }

        let mut file = BufWriter::new(File::create(output_path).context("Failed to create output file")?);
        file.write_all(cleaned_content.as_bytes()).context("Failed to write to output file")?;

        self.add_document(pdf_path, &cleaned_content);
        Ok(())
    }
    
    

    pub fn retrieve(&self, query: &str, top_k: usize) -> Vec<String> {
        let query = query.to_lowercase();
        let mut results: Vec<(String, usize)> = self
            .document_store
            .iter()
            .map(|(doc_id, content)| {
                let normalized_content = content.to_lowercase();
                let score = normalized_content.matches(&query).count();
                (doc_id.clone(), score)
            })
            .filter(|(_, score)| *score > 0)
            .collect();

        results.sort_by(|a, b| b.1.cmp(&a.1));
        results.into_iter().take(top_k).map(|(doc_id, _)| doc_id).collect()
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let mut rag_system = RAGSystem::new();
    let pdf_path = "/home/kyomoto/Decentralearn/src/rag.pdf";
    let output_path = "processed.txt";
    
    match rag_system.add_pdf_document(pdf_path, output_path) {
        Ok(_) => println!("PDF document processed and saved to {}", output_path),
        Err(e) => eprintln!("Error processing PDF document: {}", e),
    }

    let query = "How to use assembly in Arduino";
    let retrieved_docs = rag_system.retrieve(query, 2);
    
    println!("Query: {}", query);
    println!("Retrieved Documents: {:?}", retrieved_docs);

    let context: String = retrieved_docs
        .iter()
        .filter_map(|doc_id| rag_system.document_store.get(doc_id))
        .cloned()
        .collect::<Vec<String>>()
        .join("\n");

    if context.is_empty() {
        println!("No relevant documents found. Proceeding with general knowledge.");
    }

    let response = gemini_rs::chat("gemini-2.0-flash")
        .send_message(&format!("Context: {}\n\nQuestion: {}", context, query))
        .await?;
    
    println!("Response: {}", response);
    
    Ok(())
}
