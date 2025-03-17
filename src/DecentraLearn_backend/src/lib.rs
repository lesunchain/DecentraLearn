mod models;
mod controllers;

use candid::Principal;
use models::course::*;
use controllers::course::*;

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
