mod models;
mod controllers;

use candid::Principal;
use models::course::*;
use models::module::{Module, ModuleEntry};  // Add ModuleEntry
use models::lesson::{Lesson, LessonEntry};  // Add lesson imports

pub use controllers::course::*;
pub use controllers::module::*;
pub use controllers::lesson::*; 
pub use controllers::progress::*;

use ic_cdk::update;
use ic_llm::{ChatMessage, Model};

#[update]
async fn prompt(prompt_str: String) -> String {
    ic_llm::prompt(Model::Llama3_1_8B, prompt_str).await
}

#[update]
async fn chat(messages: Vec<ChatMessage>) -> String {
    ic_llm::chat(Model::Llama3_1_8B, messages).await
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();