export const VALIDATE_EMAIL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{1,}@[a-z0-9]{1,}(\.[a-z0-9]{1,}){1,2}$/

export const ROLE = new Array()
ROLE['ADMIN'] = 2
ROLE['USER'] = 1

export const TYPE_NOTIFY = new Array()
TYPE_NOTIFY['ADD_FRIEND'] = 1
TYPE_NOTIFY['REQUEST_JOIN_GROUP'] = 2
TYPE_NOTIFY['CONFIRM_FRIEND'] = 3
TYPE_NOTIFY['CONFIRM_JOIN_GROUP'] = 4
TYPE_NOTIFY['LIKE'] = 5

export const CHECK_READ_NOTIFY = new Array()
CHECK_READ_NOTIFY['WATCHED'] = 1
CHECK_READ_NOTIFY['NOT_SEEN'] = 2

export const CHECK_CHANGE_PASS = new Array()
CHECK_CHANGE_PASS['CHANGED'] = 1
CHECK_CHANGE_PASS['UN_CHANGE'] = 2

export const TYPE_ACCOUNT = new Array()
TYPE_ACCOUNT['FACEBOOK'] = 1
TYPE_ACCOUNT['GOOGLE'] = 2
TYPE_ACCOUNT['BASIC'] = 3

export const ROLE_GROUP = new Array()
ROLE_GROUP['ADMIN'] = 1
ROLE_GROUP['COLLABORATOR'] = 2
ROLE_GROUP['MEMBER'] = 3

export const STATUS_USER_GROUP = new Array()
STATUS_USER_GROUP['JOINED'] = 1
STATUS_USER_GROUP['WAIT_CONFIRMATION'] = 2
STATUS_USER_GROUP['NOT_IN_GROUP'] = 3

export const GENDER = new Array()
GENDER['MALE'] = 1
GENDER['FEMALE'] = 2

export const STATUS_FRIEND = new Array()
STATUS_FRIEND['WAIT_CONFIRMATION'] = 1
STATUS_FRIEND['CONFIRMED'] = 2
STATUS_FRIEND['IRRELEVANT'] = 3
STATUS_FRIEND['INVITATION_SENT'] = 4
STATUS_FRIEND['INVITED'] = 5

export const TYPE_GROUP = new Array()
TYPE_GROUP['PUBLIC'] = 1
TYPE_GROUP['PRIVATE'] = 2