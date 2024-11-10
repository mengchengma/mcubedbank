// Initialize Supabase client
const supabaseUrl = 'your supabaseUrl'
const supabaseKey = 'your supabaseKey'

const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)

// Test database connection
async function testConnection() {
    try {
        const { data, error } = await client
            .from('users')
            .select('*')
            .limit(1)
        
        if (error) {
            console.error('Database connection error:', error)
            return false
        }
        
        console.log('Successfully connected to database!')
        console.log('Test query result:', data)
        return true
    } catch (error) {
        console.error('Connection test failed:', error)
        return false
    }
}

// Run the test when the page loads
testConnection()

// Handle signup
const signupForm = document.getElementById('signup-form')
if (signupForm) {
    console.log('Signup form found')
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        console.log('Signup attempt...')
        
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirm-password').value

        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return
        }

        try {
            // Directly insert into users table
            const { data, error } = await client
                .from('users')
                .insert([
                    { 
                        email: email, 
                        password: password,
                        created_at: new Date().toISOString() 
                    }
                ])
                .select()

            if (error) throw error

            console.log('Data inserted successfully:', data)
            alert('Registration successful!')
            window.location.href = 'login.html'
        } catch (error) {
            console.error('Error:', error)
            alert('Error signing up: ' + error.message)
        }
    })
}

// Handle login
const loginForm = document.getElementById('login-form')
if (loginForm) {
    console.log('Login form found')
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        console.log('Login attempt...')
        
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            const { data, error } = await client
                .from('users')
                .select()
                .eq('email', email)
                .eq('password', password)
                .limit(1)

            if (error) throw error

            if (data && data.length > 0) {
                console.log('Login successful')
                window.location.href = '../dashboard.html'
            } else {
                alert('Invalid email or password')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error logging in: ' + error.message)
        }
    })
} 