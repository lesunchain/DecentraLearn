mod models;
mod controllers;

use candid::Principal;
use models::course::*;
use models::module::Module;  // Add this line
use models::lesson::Lesson;  // Add this line
use models::enrollment::Enrollment;  // Add this line

use controllers::lesson::*;
use controllers::course::*;
use controllers::module::*;
use controllers::progress::*;
use controllers::enrollment::*;
use std::collections::HashMap;
#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::caller()
}

fn add_lesson(module_id: u32, title: String, content: String, order: u32) -> u32 {
    controllers::lesson::add_lesson(module_id, title, content, order)
}

fn get_lessons_by_module(module_id: u32) -> Vec<models::lesson::Lesson> {
    controllers::lesson::get_lessons_by_module(module_id)
}

// Export candid interface
ic_cdk::export_candid!();
