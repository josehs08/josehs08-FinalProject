const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
			user: localStorage.getItem("user") || null,
		},
		actions: {
			register: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/users`, {
						method: "POST",
						headers: { 'Content-Type': 'application/json' },
						body: user
					})
					if (response.ok) {
						return response.status;
					}
					throw new Error(`Error registering user: ${response.statusText}`);
				} catch (error) {
					console.error(error);
				}
			},
			login: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { 'Content-Type': 'application/json' },
						body: user
					})
					console.log('User:', user)
					console.log('Response:', response)
					const data = await response.json()
					console.log("Data:", data)
					if (response == 200) {
						setStore({
							token: data.token
						})
						localStorage.setItem("token", data.token)
						getActions().getUserLogin()
						return true
					} else {
						console.log(response)
						return false
					}
				} catch (error) {
					console.log(error)
					console.log("aqui")
				}
			},
			getUserLogin: async () => {
				try {
					console.log("Pase por aqui")
					const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${getStore().token}`
						}
					})
					const data = await response.json()

					if (response.ok) {
						setStore({
							user: data
						})

						localStorage.setItem("user", JSON.stringify(data))
					}

				} catch (error) {
					console.log(error)
				}
			}
		}
	};
};

export default getState;
