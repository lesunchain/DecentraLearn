// src/models/chat.rs
use serde::{Serialize, Deserialize};
use ic_llm::{ChatMessage, Role};

#[derive(Serialize, Deserialize, Debug)]
pub struct ChatRequest {
    pub role: String,
    pub content: String,
}

impl ChatRequest {
    pub fn to_chat_message(&self) -> ChatMessage {
        ChatMessage {
            role: match self.role.as_str() {
                "system" => Role::System,
                "user" => Role::User,
                _ => Role::User, // Default to User
            },
            content: self.content.clone(),
        }
    }
}

