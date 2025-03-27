#!/bin/bash
# test_backend.sh

echo "===== Testing DecentraLearn Backend ====="

echo -e "\n1. Creating a test course..."
COURSE_ID=$(dfx canister call DecentraLearn_backend add_course '(record { course_name = "Learning Rust"; course_desc = "A comprehensive Rust course"; course_topics = vec { "Programming"; "Rust" }; course_image_link = "https://example.com/rust.png"; course_estimated_time_in_hours = 10 : nat32 })' | tr -d '(' | tr -d ')' | awk '{print $1}')
echo "Course created with ID: $COURSE_ID"

echo -e "\n2. Adding modules..."
# Add Module 1
MODULE1=$(dfx canister call DecentraLearn_backend add_module "($COURSE_ID : nat32, \"Introduction to Rust\", \"Basic concepts and setup\", 1 : nat32, \"<p>Welcome to Rust programming!</p>\")" | tr -d '(' | tr -d ')' | awk '{print $1}')
echo "Module 1 created with ID: $MODULE1"

# Add Module 2
MODULE2=$(dfx canister call DecentraLearn_backend add_module "($COURSE_ID : nat32, \"Variables and Data Types\", \"Learn about Rust's type system\", 2 : nat32, \"<p>Rust has a strong type system...</p>\")" | tr -d '(' | tr -d ')' | awk '{print $1}')
echo "Module 2 created with ID: $MODULE2"

# Add Module 3
MODULE3=$(dfx canister call DecentraLearn_backend add_module "($COURSE_ID : nat32, \"Control Flow\", \"Conditionals and loops in Rust\", 3 : nat32, \"<p>Let's explore control flow in Rust...</p>\")" | tr -d '(' | tr -d ')' | awk '{print $1}')
echo "Module 3 created with ID: $MODULE3"

echo -e "\n3. Retrieving modules for course $COURSE_ID..."
dfx canister call DecentraLearn_backend get_course_modules "($COURSE_ID : nat32)"

echo -e "\n4. Getting module count..."
MODULE_COUNT=$(dfx canister call DecentraLearn_backend get_module_count "($COURSE_ID : nat32)" | tr -d '(' | tr -d ')')
echo "Module count: $MODULE_COUNT"

echo -e "\n5. Initializing progress for course..."
INIT_RESULT=$(dfx canister call DecentraLearn_backend initialize_course_progress "($COURSE_ID : nat32)" | tr -d '(' | tr -d ')')
echo "Progress initialized: $INIT_RESULT"

echo -e "\n6. Getting current module..."
CURRENT_MODULE=$(dfx canister call DecentraLearn_backend get_current_module "($COURSE_ID : nat32)" | tr -d '(' | tr -d ')')
echo "Current module: $CURRENT_MODULE"

echo -e "\n7. Getting completed modules (should be empty)..."
COMPLETED_MODULES=$(dfx canister call DecentraLearn_backend get_completed_modules "($COURSE_ID : nat32)")
echo "Completed modules: $COMPLETED_MODULES"

echo -e "\n8. Completing module 1..."
COMPLETE_RESULT=$(dfx canister call DecentraLearn_backend complete_module "($COURSE_ID : nat32, $MODULE1 : nat32)" | tr -d '(' | tr -d ')')
echo "Module completion result: $COMPLETE_RESULT"

echo -e "\n9. Getting updated completed modules..."
COMPLETED_MODULES=$(dfx canister call DecentraLearn_backend get_completed_modules "($COURSE_ID : nat32)")
echo "Completed modules: $COMPLETED_MODULES"

echo -e "\n10. Getting updated current module..."
CURRENT_MODULE=$(dfx canister call DecentraLearn_backend get_current_module "($COURSE_ID : nat32)" | tr -d '(' | tr -d ')')
echo "Current module: $CURRENT_MODULE"

echo -e "\n11. Getting course completion percentage..."
COMPLETION=$(dfx canister call DecentraLearn_backend get_course_completion "($COURSE_ID : nat32)" | tr -d '(' | tr -d ')')
echo "Course completion: $COMPLETION%"

echo -e "\n12. Completing module 2..."
COMPLETE_RESULT=$(dfx canister call DecentraLearn_backend complete_module "($COURSE_ID : nat32, $MODULE2 : nat32)" | tr -d '(' | tr -d ')')
echo "Module completion result: $COMPLETE_RESULT"

echo -e "\n13. Getting updated completion percentage..."
COMPLETION=$(dfx canister call DecentraLearn_backend get_course_completion "($COURSE_ID : nat32)" | tr -d '(' | tr -d ')')
echo "Course completion: $COMPLETION%"

echo -e "\n14. Completing module 3..."
COMPLETE_RESULT=$(dfx canister call DecentraLearn_backend complete_module "($COURSE_ID : nat32, $MODULE3 : nat32)" | tr -d '(' | tr -d ')')
echo "Module completion result: $COMPLETE_RESULT"

echo -e "\n15. Checking if course is completed..."
IS_COMPLETED=$(dfx canister call DecentraLearn_backend is_course_completed "($COURSE_ID : nat32)" | tr -d '(' | tr -d ')')
echo "Course completed: $IS_COMPLETED"

echo -e "\n===== Test Complete ====="