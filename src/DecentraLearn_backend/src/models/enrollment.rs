use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ModuleProgress {
    pub module_id: u32,
    pub completed: bool,
    pub last_accessed: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Enrollment {
    pub user_id: Principal,
    pub course_id: u32,
    pub enrolled_date: u64,
    pub last_accessed_date: u64,
    pub current_module_id: u32,
    pub modules_progress: Vec<ModuleProgress>,
    pub completed: bool,
}