const API_URL = 'http://localhost:3100/';
        
        async function testBackend() {
            await makeRequest('/', 'testBtn', 'Testing Root Route...');
        }
        
        async function testUsers() {
            await makeRequest('/users', 'usersBtn', 'Fetching Users...');
        }
        
        async function makeRequest(endpoint, buttonId, loadingText) {
            const button = document.getElementById(buttonId);
            const responseDiv = document.getElementById('response');
            const originalText = button.textContent;
            
            // Show loading state
            button.disabled = true;
            button.textContent = loadingText;
            responseDiv.innerHTML = '<div class="loading">Connecting to backend...</div>';
            
            try {
                const response = await fetch(API_URL + endpoint.substring(1), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const isArray = Array.isArray(data);
                    const itemCount = isArray ? data.length : null;
                    
                    responseDiv.innerHTML = `
                        <div class="success">
                            <strong>✅ Success!</strong>
                            <p>Backend responded successfully to <code>${endpoint}</code></p>
                            ${itemCount !== null ? `<p><strong>Found ${itemCount} ${itemCount === 1 ? 'user' : 'users'}</strong></p>` : ''}
                            <strong>Response:</strong>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                            <small>Status: ${response.status} ${response.statusText}</small>
                        </div>
                    `;
                } else {
                    const errorText = await response.text();
                    responseDiv.innerHTML = `
                        <div class="error">
                            <strong>❌ Error!</strong>
                            <p>Backend responded with an error for <code>${endpoint}</code></p>
                            <strong>Status:</strong> ${response.status} ${response.statusText}
                            <pre>${errorText}</pre>
                        </div>
                    `;
                }
            } catch (error) {
                responseDiv.innerHTML = `
                    <div class="error">
                        <strong>❌ Connection Error!</strong>
                        <p>Could not connect to <code>${endpoint}</code>. Make sure:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>Your backend is running on port 3100</li>
                            <li>CORS is enabled if needed</li>
                            <li>The route exists in your backend</li>
                            <li>MongoDB is connected</li>
                        </ul>
                        <strong>Error details:</strong>
                        <pre>${error.message}</pre>
                    </div>
                `;
            } finally {
                // Reset button state
                button.disabled = false;
                button.textContent = originalText;
            }
        }
        
        function clearResponse() {
            document.getElementById('response').innerHTML = '';
        }