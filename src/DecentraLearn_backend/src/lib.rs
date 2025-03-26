//src/lib.rs
mod models;
mod controllers;
mod services;

use ic_cdk::update;
use candid::Principal;
use models::course::*;
use controllers::course::*;
use ic_llm::{ChatMessage, Model};


#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}   

#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::caller()
}


#[update]
async fn prompt(prompt_str: String) -> String {
    ic_llm::prompt(Model::Llama3_1_8B, prompt_str).await
}

#[update]
async fn chat(messages: Vec<ChatMessage>) -> String {
    ic_llm::chat(Model::Llama3_1_8B, messages).await
}

// Export candid interface
ic_cdk::export_candid!();
