const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
			user: JSON.parse(localStorage.getItem("user")) || null,
			habit: []
		},
		actions: {
			updateUser: async (userData) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${userData.id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(userData),
					});
					if (!response.ok) throw new Error("Failed to update user");
					const data = await response.json();
					setStore({ user: data });
					return true;
				} catch (error) {
					console.error("Error updating user:", error);
					return false;
				}
			},

			register: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/users`, {
						method: "POST",
						body: user
					})
					if (response.ok) {
						return true;
					}
					return (false);
				} catch (error) {
					console.error(error);
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
						return false
					}
				} catch (error) {
					console.error(error);
				}
			},
			logout: (history) => {
				setStore({
					token: null,
					user: null,
					habit: [],
					skills: [],
					completedHabits: [],

				});
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				alert("You have been logged out successfully.");
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
					console.error(error)
				}
			},
			addHabit: async (habit) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/habit`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(habit)
					})
					console.log(response)
					const data = await response.json()

					if (response.ok) {
						getActions().showHabit(getStore().user.id)
						return true;
					}
					return false
				} catch (error) {
					console.error(error);
				}
			},
			showHabit: async (user_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${user_id}/habits`)
					if (!response.ok) {
						throw new Error(`Error fetching user data: ${response.status} ${response.statusText}`);
					}
					const data = await response.json()
					setStore({
						habit: data
					})
				}
				catch (error) {
					console.error(error);

				}
			},
			getSkills: async (user_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${user_id}/skills`)
					if (!response.ok) {
						throw new Error(`Error fetching skills data: ${response.status} ${response.statusText}`);
					}
					const data = await response.json()
					setStore({
						skills: data
					})
				}
				catch (error) {
					console.error(error);
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
					console.error(error)
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
					console.error(error)
				}
			},

			completeHabit: async (habit_id, user_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/habit/${habit_id}/${user_id}/complete`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
						}
					);
					if (response.ok) {
						getActions().getCompletedHabits(getStore().user.id);
					}
				} catch (error) {
					console.error(error);
				}
			},
			getCompletedHabits: async (user_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${user_id}/habitlog`)
					if (!response.ok) {
						throw new Error(`Error fetching skills data: ${response.status} ${response.statusText}`);
					}
					const data = await response.json()
					console.log('Data received:', data)
					setStore({
						completedHabits: data
					})
					getActions().getSkills(getStore().user.id);
				}
				catch (error) {
					console.error(error);
				}
			},
			changeHabitDeleted: async (habit_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/habits/${habit_id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ deleted: true })
					}
					);
					if (response.ok) {
						getActions().showHabit(getStore().user.id)
					}
				} catch (error) {
					console.error(error);
				}
			},

			resetPassword: async (email) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify(email)
						}
					)
					console.log(response)
				} catch (error) {
					console.log(error)
				}
			},
			updatePassword: async (tokenUpdate, newPass) => {
				try {
					let response = await fetch(`${process.env.BACKEND_URL}/api/update-password`, {
						method: "PUT",
						headers: {
							"Authorization": `Bearer ${tokenUpdate}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify(newPass)
					})
					console.log(response)
				} catch (error) {
					console.log(error)
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
						getActions().showHabit(getStore().user.id)
					}
					return true;
				}
				catch (error) {
					console.error(error);
				}
			},
		}
	}
}
export default getState;
