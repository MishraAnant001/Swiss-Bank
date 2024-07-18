export const DB_MESSAGES = {
    CONNECT_SUCCESS: 'Database connected successfully',
    CONNECT_ERROR: 'Error while connecting database'
}

export const SERVER_MESSAGES = {
    START_SUCCESS: 'Server is running on port',
}

export const USER_MESSAGES = {
    CREATE_SUCCESS: 'User registered successfully',
    NOT_FOUND: 'User not found',
    UPDATE_SUCCESS: 'User updated successfully',
    DELETE_SUCCESS: 'User deleted successfully',
    FETCH_SUCCESS: 'User fetched successfully'
}

export const AUTH_MESSAGES = {
    INVALID_PASSWORD: 'password not valid!',
    LOGIN_SUCCESS: 'Login successfull',
    UNAUTHORIZED: 'unauthorized access!',
    TOKEN_EXPIRED: 'token expired! kindly login again',
    TOKEN_INVALID: 'token not valid!',
}

export const ACCOUNT_MESSAGES = {
    CREATE_SUCCESS: 'Account created successfully',
    NOT_FOUND: 'No Account found',
    UPDATE_SUCCESS: 'Account updated successfully',
    DELETE_SUCCESS: 'Account deleted successfully',
    FETCH_SUCCESS: 'Account fetched successfully'
}
export const TRANSACTION_MESSAGES = {
    COMPLETE: 'Transaction completed successfully',
    NOT_FOUND: 'Transaction not found',
    FAILED: 'Transaction failed!',
    INSUFFICIENT_BALANCE: 'Insufficient balance!',
    FETCH_SUCCESS: 'Transaction fetched successfully'
}
