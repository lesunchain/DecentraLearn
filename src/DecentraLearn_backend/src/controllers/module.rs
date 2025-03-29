use std::cell::RefCell;
use std::collections::HashMap;
use crate::models::module::{Module, ModuleEntry};

thread_local! {
    static MODULES: RefCell<HashMap<u32, Module>> = RefCell::new(HashMap::new());
    static NEXT_MODULE_ID: RefCell<u32> = RefCell::new(1);
}

// Get all modules
#[ic_cdk::query]
pub fn get_modules() -> Vec<ModuleEntry> {
    MODULES.with(|modules| {
        modules.borrow()
            .iter()
            .map(|(&id, module)| ModuleEntry { module_id: id, module: module.clone() })
            .collect()
    })
}

// Get all modules for a specific course
#[ic_cdk::query]
pub fn get_course_modules(course_id: u32) -> Vec<ModuleEntry> {
    MODULES.with(|modules| {
        modules.borrow()
            .iter()
            .filter(|(_, module)| module.course_id == course_id)
            .map(|(&id, module)| ModuleEntry { module_id: id, module: module.clone() })
            .collect()
    })
}

// Get a specific module by ID
#[ic_cdk::query]
pub fn get_module(module_id: u32) -> Option<Module> {
    MODULES.with(|modules| modules.borrow().get(&module_id).cloned())
}

// Add a new module with auto-incrementing module_id
#[ic_cdk::update]
pub fn add_module(module: Module) -> u32 {
    NEXT_MODULE_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let module_id = *next_id;
        
        MODULES.with(|modules| {
            modules.borrow_mut().insert(module_id, module);
        });

        *next_id += 1;
        module_id
    })
}

// Edit an existing module
#[ic_cdk::update]
pub fn edit_module(module_id: u32, updated_module: Module) -> bool {
    MODULES.with(|modules| {
        let mut modules = modules.borrow_mut();
        if modules.contains_key(&module_id) {
            modules.insert(module_id, updated_module);
            return true;
        }
        false
    })
}

// Delete a module
#[ic_cdk::update]
pub fn remove_module(module_id: u32) -> bool {
    MODULES.with(|modules| modules.borrow_mut().remove(&module_id).is_some())
}

// Get the number of modules in a course
#[ic_cdk::query]
pub fn get_module_count(course_id: u32) -> u32 {
    MODULES.with(|modules| {
        modules.borrow()
            .iter()
            .filter(|(_, module)| module.course_id == course_id)
            .count() as u32
    })
}