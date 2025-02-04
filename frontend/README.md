# Student API Routes

## Authentication and Authorization
- All routes require JWT Authentication
- Most routes use Role-based Access Control with `@Roles(UserRole.STUDENT)`
- Authentication Token must be passed in `Authorization` header as Bearer token

## Student Profile Routes
### Student Profile Controller
- `GET /student/profile`
  - **Response**: 
    ```json
    {
      "name": "string",
      "email": "string",
      "educationLevel": "UNDERGRADUATE",
      "recommendedCourses": ["courseId1", "courseId2"],
      "profilePhotoUrl": "string (optional)"
    }
    ```

- `PUT /student/profile`
  - **Request Body**: 
    ```json
    {
      "name": "string (optional)",
      "email": "string (optional)",
      "educationLevel": "UNDERGRADUATE (optional)",
      "recommendedCourses": ["courseId1", "courseId2"] (optional)
    }
    ```
  - **Response**: Updated profile object

- `POST /student/profile/upload-photo`
  - **Request**: Multipart form-data with file
  - **Response**: 
    ```json
    {
      "profilePhotoUrl": "string",
      "message": "Profile photo uploaded successfully"
    }
    ```

## Course Routes
### Course Controller
- `GET /student/courses`
  - **Query Params**:
    - `category`: Filter by course category
    - `difficulty`: Filter by course difficulty
    - `page`: Pagination page number
    - `limit`: Number of courses per page
  - **Response**:
    ```json
    {
      "courses": [
        {
          "_id": "courseId",
          "title": "Course Title",
          "description": "Course Description",
          "category": "Programming",
          "difficulty": "Beginner",
          "coverImage": "url_to_image",
          "instructorName": "Instructor Name"
        }
      ],
      "total": 100,
      "page": 1,
      "totalPages": 10
    }
    ```

- `GET /student/courses/:courseId`
  - **Description**: Get detailed information about a specific course for a student
  - **Authorization**: Requires student to be enrolled in the course
  - **Response**:
    ```json
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "difficulty": "BEGINNER | INTERMEDIATE | ADVANCED",
      "coverImage": "string (URL)",
      "instructor": {
        "_id": "string",
        "name": "string",
        "email": "string",
        "profilePhoto": "string (URL)"
      },
      "enrollmentStatus": "ACTIVE | PENDING | COMPLETED | DROPPED"
    }
    ```
  - **Error Responses**:
    - 400: Not enrolled in the course
    - 404: Course not found

- `POST /student/courses/:courseId/enroll`
  - **Response**:
    ```json
    {
      "message": "Successfully enrolled in course",
      "enrollment": {
        "courseId": "string",
        "studentId": "string",
        "enrolledAt": "date",
        "status": "ACTIVE"
      }
    }
    ```

## Course Enrollment Routes

### Enroll in a Course
- **Endpoint**: `POST /student/courses/:courseId/enroll`
- **Authentication**: Required (JWT Bearer Token)
- **Description**: Allows a student to enroll in a specific course

#### Request Parameters
- `courseId` (path, required): Unique identifier of the course
- `body` (optional): Additional enrollment details

#### Possible Responses
- `201 Created`: Successfully enrolled in the course
  ```json
  {
    "_id": "enrollment_id",
    "studentId": "user_id",
    "courseId": "course_id",
    "status": "ACTIVE",
    "enrolledAt": "2025-02-01T16:00:00Z"
  }
  ```
- `400 Bad Request`: 
  - Already enrolled in the course
  - Course not found
- `401 Unauthorized`: Authentication failed

### Get Enrolled Courses
- **Endpoint**: `GET /student/courses/enrolled`
- **Authentication**: Required (JWT Bearer Token)
- **Description**: Retrieve all courses a student is currently enrolled in

#### Possible Responses
- `200 OK`: List of enrolled courses
  ```json
  [
    {
      "_id": "enrollment_id",
      "courseId": "course_id",
      "status": "ACTIVE",
      "enrolledAt": "2025-02-01T16:00:00Z"
    }
  ]
  ```
- `401 Unauthorized`: Authentication failed

### Get Course Progress
- **Endpoint**: `GET /student/courses/:courseId/progress`
- **Authentication**: Required (JWT Bearer Token)
- **Description**: Retrieve progress details for a specific course

#### Request Parameters
- `courseId` (path, required): Unique identifier of the course

#### Possible Responses
- `200 OK`: Course enrollment and progress details
  ```json
  {
    "_id": "enrollment_id",
    "courseId": "course_id",
    "status": "ACTIVE",
    "progress": 50,
    "startedAt": "2025-02-01T16:00:00Z"
  }
  ```
- `404 Not Found`: Course enrollment not found
- `401 Unauthorized`: Authentication failed

## Quiz Interaction Routes

### Submit Quiz
- **Endpoint**: `POST /student/quizzes/:courseId/:quizId/submit`
- **Authentication**: Required (JWT Bearer Token)
- **Description**: Submit answers for a specific quiz within a course

#### Request Parameters
- `courseId` (path, required): ID of the course
- `quizId` (path, required): ID of the quiz
- `answers` (body, required): Array of selected answers

#### Request Body Example
```json
{
  "answers": ["option_a", "option_b", "option_c"]
}
```

#### Possible Responses
- `201 Created`: Quiz submitted successfully
  ```json
  {
    "_id": "quiz_attempt_id",
    "studentId": "user_id",
    "quizId": "quiz_id",
    "courseId": "course_id",
    "score": 75,
    "totalQuestions": 10,
    "isPassed": true,
    "submittedAt": "2025-02-01T16:00:00Z"
  }
  ```
- `400 Bad Request`: 
  - Not enrolled in course
  - Invalid quiz
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: Course or quiz not found

### Get Student Quizzes
- **Endpoint**: `GET /student/quizzes/:courseId`
- **Authentication**: Required (JWT Bearer Token)
- **Description**: Retrieve all quiz attempts for a specific course

#### Request Parameters
- `courseId` (path, required): ID of the course

#### Possible Responses
- `200 OK`: List of quiz attempts
  ```json
  [
    {
      "_id": "quiz_attempt_id",
      "quizId": "quiz_id",
      "score": 80,
      "isPassed": true,
      "submittedAt": "2025-02-01T16:00:00Z"
    }
  ]
  ```
- `400 Bad Request`: Invalid course ID
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: Course not found

### Get Quiz Details
- **Endpoint**: `GET /student/quizzes/:courseId/:quizId`
- **Authentication**: Required (JWT Bearer Token)
- **Description**: Retrieve details of a specific quiz attempt

#### Request Parameters
- `courseId` (path, required): ID of the course
- `quizId` (path, required): ID of the quiz

#### Possible Responses
- `200 OK`: Detailed quiz attempt information
  ```json
  {
    "_id": "quiz_attempt_id",
    "quizId": "quiz_id",
    "courseId": "course_id",
    "score": 90,
    "totalQuestions": 10,
    "isPassed": true,
    "answers": [
      {
        "questionId": "question_1",
        "selectedAnswer": "option_a",
        "isCorrect": true
      }
    ],
    "submittedAt": "2025-02-01T16:00:00Z"
  }
  ```
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: Course or quiz not found

## Learning Path Routes
### Learning Path Controller
- `GET /student/learning-paths`
  - **Response**:
    ```json
    {
      "learningPaths": [
        {
          "_id": "pathId",
          "title": "Learning Path Title",
          "description": "Learning Path Description",
          "courses": ["courseId1", "courseId2"]
        }
      ]
    }
    ```

- `GET /student/learning-paths/:pathId`
  - **Response**:
    ```json
    {
      "_id": "pathId",
      "title": "Learning Path Title",
      "description": "Learning Path Description",
      "courses": ["courseId1", "courseId2"]
    }
    ```

- `POST /student/learning-paths/start/:pathId`
  - **Response**:
    ```json
    {
      "message": "Learning path started successfully",
      "learningPath": {
        "pathId": "string",
        "studentId": "string",
        "startedAt": "date",
        "status": "IN_PROGRESS"
      }
    }
    ```

## Quiz Routes
### Quiz Controller
- `GET /student/quizzes/:courseId`
  - **Response**:
    ```json
    {
      "quizzes": [
        {
          "_id": "quizId",
          "title": "Quiz Title",
          "description": "Quiz Description",
          "questions": ["questionId1", "questionId2"]
        }
      ]
    }
    ```

- `POST /student/quizzes/:courseId/submit`
  - **Request Body**:
    ```json
    {
      "quizId": "string",
      "answers": [
        {
          "questionId": "string",
          "selectedAnswer": "string"
        }
      ]
    }
    ```
  - **Response**:
    ```json
    {
      "score": 80,
      "totalQuestions": 10,
      "passingScore": 70,
      "isPassed": true,
      "xpEarned": 50,
      "badges": [
        {
          "type": "QUIZ_MASTER",
          "name": "Course Quiz Master"
        }
      ]
    }
    ```

## Assignment Routes
### Assignment Controller
- `GET /student/assignments/:courseId`
  - **Response**:
    ```json
    {
      "assignments": [
        {
          "_id": "assignmentId",
          "title": "Assignment Title",
          "description": "Assignment Description",
          "dueDate": "date"
        }
      ]
    }
    ```

- `POST /student/assignments/:assignmentId/submit`
  - **Request Body**:
    ```json
    {
      "submissionUrl": "string",
      "submissionText": "string (optional)",
      "attachments": ["url1", "url2"]
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Assignment submitted successfully",
      "submissionId": "string",
      "status": "SUBMITTED",
      "submittedAt": "date"
    }
    ```

## Gamification Routes
### Gamification Controller
- `GET /student/gamification/gamification-data`
  - **Response**:
    ```json
    {
      "totalXP": 1250,
      "level": 5,
      "badges": [
        {
          "type": "course_completion",
          "name": "First Course Completed",
          "description": "Completed your first course",
          "icon": "course_completion_icon"
        }
      ],
      "achievements": {
        "courses": 10,
        "quizzes": 25,
        "aiInteractions": 15
      },
      "recentXPHistory": [
        {
          "source": "course",
          "amount": 50,
          "createdAt": "2025-01-31T06:30:00Z"
        }
      ],
      "leaderboardPoints": 2500
    }
    ```

- `GET /student/gamification/leaderboard`
  - **Response**:
    ```json
    [
      {
        "userId": "user123",
        "name": "John Doe",
        "profilePicture": "https://example.com/profile.jpg",
        "totalXP": 5000,
        "level": 10,
        "badges": [
          {
            "type": "course_master",
            "name": "Course Master",
            "description": "Completed multiple courses",
            "icon": "course_master_icon"
          }
        ],
        "points": 2500
      }
    ]
    ```

## AI Chat Routes
### AI Chat Controller
- `POST /student/ai-chat/query`
  - **Request Body**:
    ```json
    {
      "query": "Explain machine learning concepts",
      "context": {
        "courseId": "optional_course_context",
        "previousMessages": ["array of previous messages"]
      }
    }
    ```
  - **Response**:
    ```json
    {
      "response": "Detailed AI explanation...",
      "sources": ["textbook1", "lecture_note"],
      "relatedConcepts": ["neural networks", "deep learning"]
    }
    ```

## Interactive Elements Routes
### Interactive Elements Controller
- `GET /student/interactive-elements/:courseId`
  - **Description**: Retrieve all interactive elements for a specific course
  - **Response**:
    ```json
    [
      {
        "_id": "elementId",
        "courseId": "courseId",
        "type": "DISCUSSION_FORUM | LIVE_CHAT | Q_AND_A | PEER_REVIEW",
        "interactions": [
          {
            "userId": "string",
            "message": "string",
            "timestamp": "date"
          }
        ],
        "participationScore": 0
      }
    ]
    ```

- `GET /student/interactive-elements/:courseId/:elementId`
  - **Description**: Get details of a specific interactive element
  - **Response**:
    ```json
    {
      "_id": "elementId",
      "courseId": "courseId",
      "type": "DISCUSSION_FORUM | LIVE_CHAT | Q_AND_A | PEER_REVIEW",
      "interactions": [
        {
          "userId": "string",
          "message": "string",
          "timestamp": "date"
        }
      ],
      "participationScore": 0
    }
    ```

- `POST /student/interactive-elements/participate`
  - **Description**: Participate in an interactive element
  - **Request Body**:
    ```json
    {
      "courseId": "string",
      "elementId": "string",
      "type": "DISCUSSION_FORUM | LIVE_CHAT | Q_AND_A | PEER_REVIEW",
      "message": "string"
    }
    ```
  - **Response**: Created StudentInteractiveElement object

## Communication Routes
### Student Communication Controller
- `POST /student/communication/send`
  - **Description**: Send a communication to an instructor
  - **Request Body**:
    ```json
    {
      "courseId": "string (MongoId)",
      "instructorId": "string (MongoId)",
      "channelType": "DISCUSSION_FORUM | LIVE_CHAT | EMAIL_NOTIFICATION",
      "message": "string (max 1000 characters)"
    }
    ```
  - **Response**:
    ```json
    {
      "_id": "string",
      "courseId": "string",
      "studentId": "string",
      "instructorId": "string",
      "channelType": "DISCUSSION_FORUM | LIVE_CHAT | EMAIL_NOTIFICATION",
      "message": "string",
      "status": "UNREAD | READ | REPLIED",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```

- `GET /student/communication`
  - **Query Parameters**:
    - `courseId`: Course ID to filter communications (required)
    - `channelType`: Filter by communication channel type (optional)
  - **Description**: Retrieve communications for a specific course
  - **Response**:
    ```json
    [
      {
        "_id": "string",
        "courseId": "string",
        "studentId": "string",
        "instructorId": "string",
        "channelType": "DISCUSSION_FORUM | LIVE_CHAT | EMAIL_NOTIFICATION",
        "message": "string",
        "status": "UNREAD | READ | REPLIED",
        "createdAt": "date",
        "updatedAt": "date"
      }
    ]
    ```

- `POST /student/communication/:communicationId/mark-read`
  - **Description**: Mark a specific communication as read
  - **Response**:
    ```json
    {
      "_id": "string",
      "courseId": "string",
      "studentId": "string",
      "instructorId": "string",
      "channelType": "DISCUSSION_FORUM | LIVE_CHAT | EMAIL_NOTIFICATION",
      "message": "string",
      "status": "READ",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```

## Q&A Routes
### Q&A Controller
- `GET /student/q-and-a/:courseId`
  - **Description**: Retrieve Q&A entries for a specific course
  - **Query Params**:
    - `page`: Pagination page number
    - `limit`: Number of Q&A entries per page
    - `status`: Filter by Q&A status (OPEN, ANSWERED, CLOSED)
  - **Response**:
    ```json
    {
      "qAndAEntries": [
        {
          "_id": "qAndAId",
          "courseId": "courseId",
          "student": {
            "_id": "userId",
            "name": "string"
          },
          "question": "string",
          "description": "string",
          "status": "OPEN | ANSWERED | CLOSED",
          "answers": [
            {
              "_id": "answerId",
              "responder": {
                "_id": "userId",
                "name": "string",
                "role": "INSTRUCTOR | STUDENT"
              },
              "content": "string",
              "timestamp": "date"
            }
          ],
          "createdAt": "date",
          "updatedAt": "date"
        }
      ],
      "total": 100,
      "page": 1,
      "totalPages": 10
    }
    ```

- `POST /student/q-and-a/create`
  - **Description**: Create a new Q&A entry
  - **Request Body**:
    ```json
    {
      "courseId": "string",
      "question": "string",
      "description": "string (optional)"
    }
    ```
  - **Response**: Created Q&A entry object

- `POST /student/q-and-a/:qAndAId/answer`
  - **Description**: Add an answer to a Q&A entry
  - **Request Body**:
    ```json
    {
      "content": "string"
    }
    ```
  - **Response**: Updated Q&A entry with new answer

- `PATCH /student/q-and-a/:qAndAId/status`
  - **Description**: Update Q&A entry status
  - **Request Body**:
    ```json
    {
      "status": "OPEN | ANSWERED | CLOSED"
    }
    ```
  - **Response**: Updated Q&A entry object

## Certificate Routes
### Certificate Controller
- `GET /student/certificates`
  - **Response**:
    ```json
    {
      "certificates": [
        {
          "_id": "certificateId",
          "courseId": "string",
          "studentId": "string",
          "issuedAt": "date",
          "status": "ISSUED"
        }
      ]
    }
    ```

- `GET /student/certificates/:courseId`
  - **Response**:
    ```json
    {
      "_id": "certificateId",
      "courseId": "string",
      "studentId": "string",
      "issuedAt": "date",
      "status": "ISSUED"
    }
    ```

- `POST /student/certificates/generate`
  - **Request Body**:
    ```json
    {
      "courseId": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Certificate generated successfully",
      "certificate": {
        "_id": "certificateId",
        "courseId": "string",
        "studentId": "string",
        "issuedAt": "date",
        "status": "ISSUED"
      }
    }
    ```

## Payment Routes
### Payment History Controller
- `GET /student/payments`
  - **Response**:
    ```json
    {
      "payments": [
        {
          "_id": "paymentId",
          "amount": 100,
          "currency": "USD",
          "paymentMethod": "CREDIT_CARD",
          "paymentDate": "date"
        }
      ]
    }
    ```

- `GET /student/payments/summary`
  - **Response**:
    ```json
    {
      "totalPayments": 1000,
      "totalRefunds": 200,
      "balance": 800
    }
    ```

## Notes Routes
### Note Controller
- `POST /student/notes/create`
  - **Request Body**:
    ```json
    {
      "courseId": "string",
      "noteText": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Note created successfully",
      "note": {
        "_id": "noteId",
        "courseId": "string",
        "studentId": "string",
        "noteText": "string",
        "createdAt": "date"
      }
    }
    ```

- `GET /student/notes/:courseId`
  - **Response**:
    ```json
    {
      "notes": [
        {
          "_id": "noteId",
          "courseId": "string",
          "studentId": "string",
          "noteText": "string",
          "createdAt": "date"
        }
      ]
    }
    ```

- `PUT /student/notes/:noteId`
  - **Request Body**:
    ```json
    {
      "noteText": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Note updated successfully",
      "note": {
        "_id": "noteId",
        "courseId": "string",
        "studentId": "string",
        "noteText": "string",
        "updatedAt": "date"
      }
    }
    ```

- `DELETE /student/notes/:noteId`
  - **Response**:
    ```json
    {
      "message": "Note deleted successfully"
    }
    ```

## Student Dashboard Routes
### Student Dashboard Controller
- `GET /student/dashboard`
  - **Response**:
    ```json
    {
      "enrolledCourses": ["course1", "course2"],
      "courseProgress": {
        "course1": {
          "completedLessons": 5,
          "totalLessons": 10,
          "progressPercentage": 50
        }
      },
      "totalStreak": 10
    }
    ```
  - **Possible Status Codes**:
    - `200`: Successfully retrieved dashboard statistics
    - `401`: Unauthorized (invalid or missing JWT token)

- `GET /student/dashboard/overview`
  - **Response**:
    ```json
    {
      "courses": [
        {
          "_id": "courseId",
          "title": "Course Title",
          "description": "Course Description",
          "category": "Programming",
          "difficulty": "Beginner",
          "coverImage": "url_to_image",
          "instructorName": "Instructor Name"
        }
      ],
      "learningPaths": [
        {
          "_id": "pathId",
          "title": "Learning Path Title",
          "description": "Learning Path Description",
          "courses": ["courseId1", "courseId2"]
        }
      ],
      "quizzes": [
        {
          "_id": "quizId",
          "title": "Quiz Title",
          "description": "Quiz Description",
          "questions": ["questionId1", "questionId2"]
        }
      ],
      "assignments": [
        {
          "_id": "assignmentId",
          "title": "Assignment Title",
          "description": "Assignment Description",
          "dueDate": "date"
        }
      ]
    }
    ```
  - **Possible Status Codes**:
    - `200`: Successfully retrieved dashboard overview
    - `401`: Unauthorized (invalid or missing JWT token)

- `GET /student/dashboard/recent-activity`
  - **Response**:
    ```json
    {
      "recentActivity": [
        {
          "type": "COURSE_ENROLLMENT",
          "courseId": "string",
          "enrolledAt": "date"
        },
        {
          "type": "QUIZ_SUBMISSION",
          "quizId": "string",
          "submittedAt": "date"
        },
        {
          "type": "ASSIGNMENT_SUBMISSION",
          "assignmentId": "string",
          "submittedAt": "date"
        }
      ]
    }
    ```

## Zoom Meeting Endpoints

### Get All Zoom Meetings
- **Endpoint**: `GET /student/zoom-meetings`
- **Description**: Retrieve all Zoom meetings for the student across enrolled courses
- **Authentication**: Required (JWT)
- **Success Response**:
  ```json
  [
    {
      "_id": "meeting123",
      "title": "Math Algebra Session",
      "courseId": {
        "title": "Advanced Mathematics"
      },
      "instructorId": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "startTime": "2025-02-15T10:00:00Z",
      "endTime": "2025-02-15T11:00:00Z",
      "meetingLink": "https://zoom.us/j/123456789",
      "description": "Weekly algebra problem-solving session"
    }
  ]
  ```

### Get Upcoming Zoom Meetings
- **Endpoint**: `GET /student/zoom-meetings/upcoming`
- **Description**: Retrieve upcoming Zoom meetings for the student across all enrolled courses
- **Authentication**: Required (JWT)
- **Success Response**: 
  ```json
  [
    {
      "_id": "meeting456",
      "title": "Science Lab Discussion",
      "courseId": {
        "title": "Advanced Biology"
      },
      "startTime": "2025-02-20T14:00:00Z",
      "endTime": "2025-02-20T15:30:00Z",
      "meetingLink": "https://zoom.us/j/987654321"
    }
  ]
  ```

### Get Course-Specific Zoom Meetings
- **Endpoint**: `GET /student/zoom-meetings/course/:courseId`
- **Description**: Retrieve all Zoom meetings for a specific course
- **Authentication**: Required (JWT)
- **URL Parameters**:
  - `courseId`: ID of the specific course
- **Success Response**: Similar to Get All Zoom Meetings, but filtered by course

### Get Upcoming Course-Specific Zoom Meetings
- **Endpoint**: `GET /student/zoom-meetings/course/:courseId/upcoming`
- **Description**: Retrieve upcoming Zoom meetings for a specific course
- **Authentication**: Required (JWT)
- **URL Parameters**:
  - `courseId`: ID of the specific course
- **Success Response**: Similar to Get Upcoming Zoom Meetings, but filtered by course

### Record Meeting Attendance
- **Endpoint**: `POST /student/zoom-meetings/:meetingId/attend`
- **Description**: Record student's attendance for a specific Zoom meeting
- **Authentication**: Required (JWT)
- **URL Parameters**:
  - `meetingId`: ID of the Zoom meeting
- **Success Response**:
  ```json
  {
    "_id": "meeting123",
    "title": "Math Algebra Session",
    "attendees": [
      {
        "studentId": "student123",
        "attendedAt": "2025-02-15T10:05:00Z"
      }
    ]
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Meeting does not exist
  - `400 Bad Request`: Student already attended the meeting

## Instructor Endpoints

### Get All Instructors
- **Endpoint**: `GET /instructors`
- **Description**: Retrieve a paginated list of instructors with optional search and sorting
- **Authentication Required**: Yes (JWT Token)
- **Roles Allowed**: Admin, Student

#### Query Parameters
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `page` | number | No | Page number for pagination | 1 |
| `limit` | number | No | Number of items per page | 10 |
| `search` | string | No | Search term to filter instructors (matches firstName, lastName, email) | - |
| `sortBy` | string | No | Field to sort instructors by | 'lastName' |

#### Sorting Options
- `firstName`
- `lastName`
- `email`

#### Success Response
```json
{
  "instructors": [
    {
      "_id": "instructorId",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "profilePicture": "url_to_profile_pic",
      "specialization": "Web Development"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### Get Instructor by ID
- **Endpoint**: `GET /instructors/:id`
- **Description**: Retrieve detailed information about a specific instructor
- **Authentication Required**: Yes (JWT Token)
- **Roles Allowed**: Admin, Student

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier of the instructor |

#### Success Response
```json
{
  "_id": "instructorId",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "profilePicture": "url_to_profile_pic",
  "specialization": "Web Development",
  "bio": "Experienced instructor with 10+ years in web development",
  "socialLinks": {
    "linkedin": "linkedin.com/in/johndoe",
    "twitter": "@johndoe"
  },
  "courses": [
    {
      "_id": "courseId",
      "title": "Advanced Web Development",
      "category": "Programming"
    }
  ]
}
```

### Get Instructor Courses
- **Endpoint**: `GET /instructors/:id/courses`
- **Description**: Retrieve all courses created by a specific instructor
- **Authentication Required**: Yes (JWT Token)
- **Roles Allowed**: Admin, Student

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier of the instructor |

#### Query Parameters
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `page` | number | No | Page number for pagination | 1 |
| `limit` | number | No | Number of items per page | 10 |

#### Success Response
```json
{
  "courses": [
    {
      "_id": "courseId",
      "title": "Advanced Web Development",
      "description": "Comprehensive course on modern web technologies",
      "category": "Programming",
      "difficulty": "Advanced",
      "coverImage": "url_to_cover_image",
      "instructorName": "John Doe"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

#### Error Responses
| Status Code | Description |
|------------|-------------|
| `200` | Successful retrieval of instructor's courses |
| `401` | Unauthorized - Invalid or missing JWT token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Instructor not found |

#### Example Requests

##### Get First Page of Instructor's Courses
```bash
GET /instructors/507f1f77bcf86cd799439011/courses
```

##### Get Second Page of Instructor's Courses
```bash
GET /instructors/507f1f77bcf86cd799439011/courses?page=2&limit=10
```

### Error Responses
| Status Code | Description |
|------------|-------------|
| `200` | Successful retrieval of instructors |
| `401` | Unauthorized - Invalid or missing JWT token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Instructor not found |

### Example Requests

#### Get First Page of Instructors
```bash
GET /instructors?page=1&limit=10
```

#### Search Instructors by Name
```bash
GET /instructors?search=John&sortBy=firstName
```

#### Get Specific Instructor
```bash
GET /instructors/507f1f77bcf86cd799439011
```

### Notes
- Results are always paginated to improve performance
- Search is case-insensitive and matches partial names or emails
- Profile pictures and additional details are included when available
- Sorting helps in easily finding specific instructors

## Error Handling
All routes follow a standard error response format:
```json
{
  "statusCode": 400,
  "message": "Detailed error description",
  "error": "Bad Request"
}
```

## Authentication Errors
- 401 Unauthorized: Invalid or expired token
- 403 Forbidden: Insufficient permissions
- 400 Bad Request: Invalid input data

## Rate Limiting
- Most routes have a rate limit of 100 requests per minute
- Exceeding limit returns 429 Too Many Requests

## Notes
- All routes are prefixed with `/student`
- Authentication is required for all routes
- Role-based access ensures only students can access these endpoints
- All timestamps are in ISO 8601 format
- All monetary values are in the smallest currency unit (cents/pennies)
