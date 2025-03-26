//src/controllers/chat.rs
use ic_llm::{Model, ChatMessage, Role};

// #[tokio::main]
pub async fn main() {
    let response = ic_llm::chat(
        Model::Llama3_1_8B,
        vec![
            ChatMessage {
                role: Role::System,
                content: "You are a helpful assistant".to_string(),
            },
            ChatMessage {
                role: Role::User,
                content: "How big is the sun?".to_string(),
            },
        ],
    )
    .await;

    println!("{:?}", response);
}

