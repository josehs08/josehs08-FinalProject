const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
			user: JSON.parse(localStorage.getItem("user")) || null,
			habit: []
		},
		actions: {
			register: async (user) => {
				try {
					console.log("user desde el front", user)
					const response = await fetch(`${process.env.BACKEND_URL}/api/users`, {
						method: "POST",
						body: user
					})
					if (response.ok) {
						return true;
					}
					return (false);
				} catch (error) {
					console.log(error);
				}
			},

			login: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(user)
					})
					const data = await response.json()
					if (response.ok) {
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
				}
			},
			logout: () => {
				setStore({
					user: null
				})
				localStorage.removeItem("token")
				localStorage.removeItem("user")
			},
			getUserLogin: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${getStore().token}`
						}
					})
					if (!response.ok) {
						throw new Error(`Error fetching user data: ${response.status} ${response.statusText}`);
					}
					const data = await response.json()
					setStore({
						user: data
					})

					localStorage.setItem("user", JSON.stringify(data))
				} catch (error) {
					console.log(error);
				}
			},
			addHabit: async (habit) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/habit`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(habit)
					})
					const data = await response.json()

					if (response.ok) {
						getActions().showHabit(getStore().user.id)
						return true;
					}
					return false
				} catch (error) {
					console.log(error);
				}
			},

			showHabit: async (user_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${user_id}/habits`)
					if (!response.ok) {
						throw new Error(`Error fetching user data: ${response.status} ${response.statusText}`);
					}
					const data = await response.json()
					console.log('Data received:', data)
					setStore({
						habit: data
					})
				}
				catch (error) {
					console.log(error);

				}
			},

			updateHabit: async (habit_id, habit) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/habits/${habit_id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(habit)
					})
					const data = await response.json()

					if (response.ok) {
						setStore({
							habit: getStore().habit.map((item) => item.id === habit_id ? data : item)
						});
						return true;
					}
					return false
				}
				catch (error) {
					console.log(error)
				}

			},
			getSkills: async (user_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${user_id}/skills`)
					if (!response.ok) {
						throw new Error(`Error fetching skills data: ${response.status} ${response.statusText}`);
					}
					const data = await response.json()
					console.log('Data received:', data)
					setStore({
						skills: data
					})
				}
				catch (error) {
					console.log(error);
				}
			},
			addSkills: async (skill) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${getStore().user.id}/skills`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(skill)
					})
					const data = await response.json()
					if (response.ok) {
						getActions().getSkills(getStore().user.id);
						return true;
					}

					return true;
				}
				catch (error) {
					console.log(error)
				}
			},
			deleteSkills: async (skill_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${getStore().user.id}/skills/${skill_id}`, {
						method: "DELETE"
					})
					if (response.ok) {
						getActions().getSkills(getStore().user.id);
						return true;
					}
				}
				catch (error) {
					console.log(error)
				}
			},

			completeHabit: async (habit_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/habits/${habit_id}/complete`, {
						method: "POST"
					})
					if (response.ok) {
						console.log('Se completo el habito')
					}
				}
				catch (error) {
					console.log(error);

				}
			}

		}
	};
};

export default getState;
