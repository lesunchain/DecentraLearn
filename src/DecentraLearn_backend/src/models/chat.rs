// src/models/chat.rs
use serde::{Serialize};
use ic_llm::{ChatMessage, Role};

use candid::{CandidType, Deserialize};


#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ChatRequest {
    pub role: String,
    pub content: String,
}

impl ChatRequest {
    pub fn to_chat_message(&self) -> ic_llm::ChatMessage {
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

