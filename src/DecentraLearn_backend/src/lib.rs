mod models;
mod controllers;

use candid::Principal;
use models::course::*;
use models::module::{Module, ModuleEntry}; 
use models::lesson::{Lesson, LessonEntry}; 
use models::enrollment::{Enrollment, ModuleProgress}; 

pub use controllers::course::*;
pub use controllers::module::*;
pub use controllers::lesson::*; 
pub use controllers::progress::*;
pub use controllers::enrollment::*;

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

#[ic_cdk::query]
pub fn whoami() -> Principal {
    ic_cdk::caller()
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();