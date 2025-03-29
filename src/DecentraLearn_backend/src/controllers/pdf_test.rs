// use anyhow::Result;
// use std::env;

// // Import directly from the local module
// use crate::models::rag_localization::{EmbeddingModel, RAGSystem};

// fn main() -> Result<()> {
//     // Get PDF path from command line arguments
//     let args: Vec<String> = env::args().collect();
//     if args.len() < 2 {
//         println!("Usage: cargo run --bin test_pdf /path/to/your/document.pdf");
//         return Ok(());
//     }
    
//     let pdf_path = &args[1];
//     println!("Testing PDF extraction from: {}", pdf_path);
    
//     // Test basic text extraction
//     match EmbeddingModel::extract_text_from_pdf(pdf_path) {
//         Ok(text) => {
//             println!("Successfully extracted text from PDF");
//             println!("First 200 characters: {}", &text.chars().take(200).collect::<String>());
//             println!("Total characters extracted: {}", text.len());
//         },
//         Err(e) => {
//             println!("Error extracting text from PDF: {}", e);
//             return Err(e);
//         }
//     }
    
//     Ok(())
// }