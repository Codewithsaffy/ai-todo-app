// actions/authActions.ts


// Register a new user
export async function registerUser(name: string, email: string, password: string) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json()
      if (!res.ok) return {message: data.error || "Registration failed"};
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Login user (token is set in an HTTP-only cookie on the server)
  export async function loginUser(email: string, password: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return {message: data.error || "Login failed"}
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Get the currently logged-in user (if any)
  export async function getCurrentUser() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!res.ok) return {message: data.error || "Not authenticated"}
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Logout the current user (clears the auth cookie)
  export async function logoutUser() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) return {message: data.error || "Logout failed"}
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Verify user's email using the token from the URL
  export async function verifyUser(token: string) {
    try {
      const res = await fetch(`/api/auth/verify/${token}`, {
        method: 'GET',
      });
      const data = await res.json();
      if (!res.ok) return {message: data.error || "Verification failed"}
      return data;
    } catch (error) {
      throw error;
    }
  }
  