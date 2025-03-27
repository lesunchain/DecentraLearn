mod models;
mod controllers;

use candid::Principal;
use models::course::*;
use models::module::Module;  // Add this line
use controllers::course::*;
use controllers::module::*;
use controllers::progress::*;

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
