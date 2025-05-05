use gemini_rs;
use std::collections::HashMap;
use std::fs::{File, read_to_string};
use std::io::{Write, BufWriter};
use anyhow::{Result, Context};
use pdf_extract::extract_text;
use regex::Regex;
use pdfium_render::prelude::*;

struct RAGSystem {
    document_store: HashMap<String, String>,
    processed_text_path: Option<String>,
}

impl RAGSystem {
    pub fn new() -> Self {
        Self {
            document_store: HashMap::new(),
            processed_text_path: None,
        }
    }

    pub fn add_document(&mut self, doc_id: &str, content: &str) {
        self.document_store.insert(doc_id.to_string(), content.to_string());
    }

    pub fn add_pdf_document(&mut self, pdf_path: &str, output_path: &str) -> Result<()> {
        // Use the pdf-extract crate which properly handles text extraction
        let content = extract_text(pdf_path)
            .context(format!("Failed to extract text from PDF: {}", pdf_path))?;

        if content.is_empty() {
            eprintln!("Warning: Extracted content is empty.");
        } else {
            println!("Extracted {} characters of text from PDF", content.len());
        }

        // Clean the extracted text (remove excessive whitespace)
        let re = Regex::new(r"\s+").unwrap();
        let cleaned_content = re.replace_all(&content, " ").trim().to_string();

        // Save cleaned text to file
        let mut file = BufWriter::new(File::create(output_path)
            .context(format!("Failed to create output file: {}", output_path))?);
        file.write_all(cleaned_content.as_bytes())
            .context("Failed to write to output file")?;
        
        println!("Extracted content saved to {}", output_path);

        // Store the path to the processed text file
        self.processed_text_path = Some(output_path.to_string());
        
        // We don't need to add this to document_store anymore as we'll read from file
        // However, we'll keep a reference to the original PDF
        self.add_document(pdf_path, "");
        
        Ok(())
    }

    pub fn retrieve(&self, query: &str, _top_k: usize) -> Result<String> {
        // Check if we have a processed text file
        if let Some(text_path) = &self.processed_text_path {
            // Read the content from the processed file
            let content = read_to_string(text_path)
                .context(format!("Failed to read processed file: {}", text_path))?;
            
            // Debug: Print file size and first few characters
            println!("Processed file size: {} bytes", content.len());
            if !content.is_empty() {
                let preview_len = content.len().min(100);
                println!("First {} characters: {}", preview_len, &content[..preview_len]);
            } else {
                println!("WARNING: Processed file is empty!");
                return Ok(String::new());
            }
            
            // Convert query to lowercase and keep it in scope
            let query_lower = query.to_lowercase();
            
            // Break query into keywords
            let keywords: Vec<String> = query_lower
                .split_whitespace()
                .map(|s| s.to_string())
                .collect();
            
            println!("Searching for keywords: {:?}", keywords);
            
            // Look for content containing any of the keywords
            let content_lower = content.to_lowercase();
            
            for keyword in &keywords {
                if content_lower.contains(keyword) {
                    println!("Found keyword: \"{}\" in document", keyword);
                    
                    // Get the position of the keyword
                    let position = content_lower.find(keyword).unwrap();
                    
                    // Get a context window around the match (300 chars before and after)
                    let start = position.saturating_sub(300);
                    let end = (position + keyword.len() + 300).min(content.len());
                    
                    return Ok(content[start..end].to_string());
                }
            }
            
            println!("None of the keywords were found in the document");
        } else {
            println!("No processed text file path is set");
        }
        
        // If no processed file or no match found
        Ok(String::new())
    }

    pub fn retrieve_img(&self, pdf_path: &str, output_dir: &str) -> Result<()> {
        // Initialize the Pdfium library
        let pdfium = Pdfium::new(Pdfium::bind_to_system_library()?);

        // Load the PDF document
        let document = pdfium.load_pdf_from_file(pdf_path, None)
            .context(format!("Failed to load PDF: {}", pdf_path))?;

        // Iterate through each page and render it as an image
        for (page_index, page) in document.pages().iter().enumerate() {
            let image = page.render()
                .render_width(1080) // Set the width of the rendered image
                .render_height(1920) // Set the height of the rendered image
                .render() // Render the page
                .context(format!("Failed to render page {}", page_index))?;

            // Save the image to the output directory
            let output_path = format!("{}/page_{}.png", output_dir, page_index + 1);
            image.save(&output_path)
                .context(format!("Failed to save image for page {}: {}", page_index, output_path))?;

            println!("Saved page {} as image: {}", page_index + 1, output_path);
        }

        Ok(())
    }

}

#[tokio::main]
async fn main() -> Result<()> {
    let mut rag_system = RAGSystem::new();
    let pdf_path = "/home/kyomoto/Decentralearn/src/rag.pdf";
    let output_path = "processed.txt";
    
    // match rag_system.add_pdf_document(pdf_path, output_path) {
    //     Ok(_) => println!("PDF document processed and saved to {}", output_path),
    //     Err(e) => eprintln!("Error processing PDF document: {}", e),
    // }

    // Convert PDF to images
    match rag_system.retrieve_img(pdf_path, output_dir) {
        Ok(_) => println!("PDF pages saved as images in {}", output_dir),
        Err(e) => eprintln!("Error converting PDF to images: {}", e),
    }

    let query = "Siapakah Michael Harditya";
    
    match rag_system.retrieve(query, 2) {
        Ok(context) => {
            println!("Query: {}", query);
            
            if context.is_empty() {
                println!("No relevant content found in processed text. Proceeding with general knowledge.");
            } else {
                println!("Retrieved relevant context of {} characters", context.len());
            }
            
            let response = gemini_rs::chat("gemini-2.0-flash")
                .send_message(&format!("Context: {}\n\nQuestion: {}", context, query))
                .await?;
            
            println!("Response: {}", response);
        },
        Err(e) => eprintln!("Error during retrieval: {}", e),
    }
    
    Ok(())
}