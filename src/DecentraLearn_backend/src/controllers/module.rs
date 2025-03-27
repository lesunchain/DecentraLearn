use std::cell::RefCell;
use std::collections::HashMap;

use crate::models::module::Module;

thread_local! {
    static MODULES: RefCell<HashMap<u32, Module>> = RefCell::new(HashMap::new());
    static COURSE_MODULES: RefCell<HashMap<u32, Vec<u32>>> = RefCell::new(HashMap::new());
    static NEXT_MODULE_ID: RefCell<u32> = RefCell::new(1);
}

// Create a new module
#[ic_cdk::update]
pub fn create_module(module: Module) -> u32 {
    let id = module.id;
    
    // Store the module
    MODULES.with(|modules| {
        modules.borrow_mut().insert(id, module.clone());
    });
    
    // Update the course-modules mapping
    COURSE_MODULES.with(|course_modules| {
        let mut course_modules_map = course_modules.borrow_mut();
        let modules_list = course_modules_map.entry(module.course_id).or_insert_with(Vec::new);
        if !modules_list.contains(&id) {
            modules_list.push(id);
        }
    });
    
    id
}

// Get module by ID
#[ic_cdk::query]
pub fn get_module(id: u32) -> Option<Module> {
    MODULES.with(|modules| {
        modules.borrow().get(&id).cloned()
    })
}

// Get all modules for a course
#[ic_cdk::query]
pub fn get_course_modules(course_id: u32) -> Vec<Module> {
    let module_ids = COURSE_MODULES.with(|course_modules| {
        course_modules.borrow()
            .get(&course_id)
            .cloned()
            .unwrap_or_else(Vec::new)
    });
    
    let mut modules = Vec::new();
    for id in module_ids {
        if let Some(module) = get_module(id) {
            modules.push(module);
        }
    }
    
    // Sort by order
    modules.sort_by(|a, b| a.order.cmp(&b.order));
    modules
}

#[ic_cdk::query]
pub fn get_module_count(course_id: u32) -> Option<u32> {
    COURSE_MODULES.with(|course_modules| {
        course_modules.borrow()
            .get(&course_id)
            .map(|module_ids| module_ids.len() as u32)
    })
}

#[ic_cdk::update]
pub fn add_module(course_id: u32, title: String, description: String, order: u32, content: String) -> u32 {
    NEXT_MODULE_ID.with(|next_id| {
        let id = *next_id.borrow();
        
        let new_module = Module {
            id,
            course_id,
            title,
            description,
            order,
            content,
        };
        
        create_module(new_module);
        
        let mut next_id_value = next_id.borrow_mut();
        *next_id_value += 1;
        
        id
    })
}