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

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::caller()
}

// Export candid interface
ic_cdk::export_candid!();