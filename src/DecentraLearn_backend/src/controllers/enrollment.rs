use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Enrollment {
    pub user_id: String,
    pub course_id: String,
}

pub struct EnrollmentController {
    enrollments: HashMap<String, Vec<Enrollment>>, // Keyed by course_id
}

impl EnrollmentController {
    pub fn new() -> Self {
        Self {
            enrollments: HashMap::new(),
        }
    }

    // Enroll a user in a course
    pub fn enroll_user(&mut self, user_id: &str, course_id: &str) -> Result<(), String> {
        let enrollment = Enrollment {
            user_id: user_id.to_string(),
            course_id: course_id.to_string(),
        };

        self.enrollments
            .entry(course_id.to_string())
            .or_insert_with(Vec::new)
            .push(enrollment);

        Ok(())
    }

    // Get all users enrolled in a course
    pub fn get_enrolled_users(&self, course_id: &str) -> Option<&Vec<Enrollment>> {
        self.enrollments.get(course_id)
    }

    // Remove a user from a course
    pub fn remove_user(&mut self, user_id: &str, course_id: &str) -> Result<(), String> {
        if let Some(enrollments) = self.enrollments.get_mut(course_id) {
            enrollments.retain(|e| e.user_id != user_id);
            Ok(())
        } else {
            Err("Course not found".to_string())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_enrollment() {
        let mut controller = EnrollmentController::new();

        // Enroll users
        controller.enroll_user("user1", "course1").unwrap();
        controller.enroll_user("user2", "course1").unwrap();

        // Check enrolled users
        let enrolled_users = controller.get_enrolled_users("course1").unwrap();
        assert_eq!(enrolled_users.len(), 2);

        // Remove a user
        controller.remove_user("user1", "course1").unwrap();
        let enrolled_users = controller.get_enrolled_users("course1").unwrap();
        assert_eq!(enrolled_users.len(), 1);
    }
}