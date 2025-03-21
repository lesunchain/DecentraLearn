use std::cell::RefCell;
use std::collections::HashMap;
use candid::Principal;
use ic_cdk::caller;
use crate::controllers::module::get_course_modules;

// Key: (user_id, course_id), Value: current_module_id
thread_local! {
    static USER_PROGRESS: RefCell<HashMap<(Principal, u32), u32>> = RefCell::new(HashMap::new());
    // Key: (user_id, course_id), Value: completed module IDs
    static COMPLETED_MODULES: RefCell<HashMap<(Principal, u32), Vec<u32>>> = RefCell::new(HashMap::new());
}

// Get module ID
#[ic_cdk::query]
pub fn get_current_module(course_id: u32) -> u32 {
    let user_id = caller();
    let key = (user_id, course_id);
    
    USER_PROGRESS.with(|progress| {
        *progress.borrow().get(&key).unwrap_or(&1)
    })
}

// Get completed mods
#[ic_cdk::query]
pub fn get_completed_modules(course_id: u32) -> Vec<u32> {
    let user_id = caller();
    let key = (user_id, course_id);
    
    COMPLETED_MODULES.with(|completed| {
        completed.borrow().get(&key).cloned().unwrap_or_default()
    })
}

// Update current module
#[ic_cdk::update]
pub fn update_current_module(course_id: u32, module_id: u32) -> bool {
    let user_id = caller();
    let key = (user_id, course_id);
    
    let modules = get_course_modules(course_id);
    let valid_module = modules.iter().any(|m| m.id == module_id);
    
    if !valid_module {
        return false;
    }
    
    USER_PROGRESS.with(|progress| {
        progress.borrow_mut().insert(key, module_id);
    });
    
    true
}

// Mark as completed
#[ic_cdk::update]
pub fn complete_module(course_id: u32, module_id: u32) -> bool {
    let user_id = caller();
    let key = (user_id, course_id);
    let modules = get_course_modules(course_id);
    let valid_module = modules.iter().any(|m| m.id == module_id);
    
    if !valid_module {
        return false;
    }
    let current_module_index = modules.iter().position(|m| m.id == module_id);
    if let Some(index) = current_module_index {
        if index + 1 < modules.len() {
            let next_module = &modules[index + 1];
            update_current_module(course_id, next_module.id);
        }
    }
    
    // Add
    COMPLETED_MODULES.with(|completed| {
        let mut completed_map = completed.borrow_mut();
        let module_list = completed_map.entry(key).or_insert_with(Vec::new);
        
        if !module_list.contains(&module_id) {
            module_list.push(module_id);
        }
    });
    
    true
}

// Get percentage
#[ic_cdk::query]
pub fn get_course_completion(course_id: u32) -> u8 {
    let user_id = caller(); 
    let modules = get_course_modules(course_id);
    
    if modules.is_empty() {
        return 0;
    }
    
    let completed = get_completed_modules(course_id);
    let total_modules = modules.len() as f32;
    let completed_count = completed.len() as f32;
    
    (completed_count / total_modules * 100.0) as u8
}

// Check completion
#[ic_cdk::query]
pub fn is_course_completed(course_id: u32) -> bool {
    let modules = get_course_modules(course_id);
    let completed = get_completed_modules(course_id);
    
    if modules.is_empty() {
        return false;
    }
    
    modules.iter().all(|m| completed.contains(&m.id))
}

// Initialize progress course
#[ic_cdk::update]
pub fn initialize_course_progress(course_id: u32) -> bool {
    let user_id = caller();
    let key = (user_id, course_id);
    let modules = get_course_modules(course_id);
    if modules.is_empty() {
        return false;
    }
    
    // Set current module ke 1
    let first_module = modules.first().map(|m| m.id).unwrap_or(1);
    
    USER_PROGRESS.with(|progress| {
        // Init hanya jika belum enrolled
        if !progress.borrow().contains_key(&key) {
            progress.borrow_mut().insert(key, first_module);
            
            // Init list empty completed modules
            COMPLETED_MODULES.with(|completed| {
                completed.borrow_mut().insert(key, Vec::new());
            });
            
            true
        } else {
            false
        }
    })
}