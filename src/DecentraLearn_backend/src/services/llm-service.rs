// src/services/llm_service.rs
use crate::models::chat::ChatRequest;
use ic_llm::{Model, chat};

pub async fn process_chat_request(requests: Vec<ChatRequest>) -> Result<String, String> {
    let messages = requests.iter().map(|req| req.to_chat_message()).collect();

    match chat(Model::Llama3_1_8B, messages).await {
        Ok(response) => Ok(response),
        Err(err) => Err(format!("LLM error: {}", err)),
    }
}

