import {useAuth} from "@clerk/clerk-react"
//import {clerkmiddleware} from "@clerk/clerk-react"

export const useApi = () => {
    const {getToken, isLoaded, isSignedIn } = useAuth();

    const makeRequest = async (endpoint, options = {}) => {
        try{
            console.log(`making request to: ${endpoint}`)
            const token = await getToken()
            console.log(`Token available: ${!!token}`)

            if (!token){
                throw new Error("No authentication token available")
            }
            const defaultOptions = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
             if (!isLoaded || !isSignedIn) 
            {   console.error('API Error:', errorData);
                throw new Error("Please sign in first");
            
            }
            // Make the request to the Backend local host port
            const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers
                }
            })

            console.log(`Response status: ${response.status}`)
        

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                console.error(`API Error ${response.status}:`, errorData)

                if(response.status === 401){
                    console.error('API Error:', errorData);
                    throw new Error("Authentication failed. please sign in again")
                }
                
                if (response.status === 400) {
                    console.error('API Error:', errorData);
                    throw new Error(errorData?.detail || "Bad request")
                }
                if (response.status === 429) {
                    console.error('API Error:', errorData);
                    throw new Error("Daily quota exceeded")
                }
                if (response.status === 404){
                    console.error('API Error:', errorData);
                    throw new Error("Resource not found")
                }
                console.error('API Error:', errorData);
                throw new Error(errorData?.detail || "An error occurred : ${response.status}")
                
            }

        const data = await response.json()
        console.log(`Response data:`, data)
        return data
    }
    catch (error){
         const errorData = error.response.data;
        console.error('API Error:', errorData);
        console.dir(errorData); // log the error data in a more readable format
        throw new Error(errorData?.detail || "An error occurred : ${response.status}")
        }
    } 
    // Define specific functions  

  const generateCaption = async (formData) => {
    const token = await getToken();
    const response = await fetch("http://localhost:8000/api/Create-content", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || "Failed to generate content");
    }
    return response.json();
  };

  const schedulePost = async (data) => {
    return await makeRequest(`create-schedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return {
    makeRequest,
    generateCaption,
    schedulePost,
    
  };
};


    

