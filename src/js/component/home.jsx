import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";

const Home = () => {
	const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
	const [tasks, setTasks] = useState([]); //Estado para almacenar las tareas
	const [selectedUser, setSelectedUser] = useState(null); // Estado del usuario seleccionado


	// useEffect para cargar usuarios al montar el componente
	useEffect(() => {
		loadUsersApi();
	}, []); // El arreglo vacío asegura que solo se ejecute una vez al montar

	// Función para cargar la lista de usuarios desde la API
	const loadUsersApi = () => {
		console.log("Cargando Usuarios desde la API...");
		fetch("https://playground.4geeks.com/todo/users/")
			.then((response) => {
				if (!response.ok) throw new Error("Error al cargar los usuarios");
				return response.json();
			})
			.then((data) => {
				//Me aseguro que el array de usuarios está disponible
				const userArray = data.users || []; //Maneja el caso donde no existan usuarios
				console.log("Usuarios cargados exitosamente:", userArray);
				setUsers(userArray); // Guardamos los usuarios en el estado

				// Buscar al usuario "MauSon"
				const userMauSon = userArray.find((user) => user.name === "MauSon");

				if (userMauSon) {
					console.log("Usuario encontrado:", userMauSon);
					setSelectedUser(userMauSon);
					loadMauSonTodo(userMauSon.name); // Carga las tareas del usuario
				} else {
					console.log("Usuario 'MauSon' no encontrado. Creando usuario...");
					createUsersApi("MauSon"); // Crea el usuario
				}
			})
			.catch((error) => {
				console.error("Error en la solicitud:", error);
			});
	};

	// Función para crear un nuevo usuario
	const createUsersApi = (userName) => {
		console.log("Creando Usuario:", userName);
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: userName }), // Enviar el nombre del usuario
		};

		fetch(`https://playground.4geeks.com/todo/users/${userName}`, requestOptions)
			.then((response) => {
				if (!response.ok) throw new Error("Error al crear el usuario");
				return response.json();
			})
			.then((newUser) => {
				console.log("Usuario creado exitosamente:", newUser)
				setSelectedUser(newUser);
				loadMauSonTodo(newUser.name); // Carga las tareas del nuevo usuario
			})
			.catch((error) => {
				console.error("Error al crear el usuario:", error);
			});
	};

	// Función para cargar las tareas de un usuario específico
	const loadMauSonTodo = (userName) => {
		console.log(`Cargando tareas para el usuario ${userName}...`);
		fetch(`https://playground.4geeks.com/todo/users/${userName}`)
			.then((response) => {
				if (!response.ok) throw new Error("Error al cargar las tareas");
				return response.json();
			})
			.then((data) => {
				// Extraer el array de tareas desde la propiedad `todos`
				const tasksArray = Array.isArray(data.todos) ? data.todos : [];
				console.log("Tareas cargadas exitosamente:", tasksArray);
				setTasks(tasksArray); // Guardar las tareas en el estado
			})
			.catch((error) => {
				console.error("Error al cargar las tareas:", error);
			});
	};

	// Función para borrar las tareas
	const deleteTodoApi = (todoId, userName) => {
		console.log("Borrando tarea con ID:", todoId);
		const requestOptions = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		};
		fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, requestOptions)
			.then((response) => {
				if (!response.ok) throw new Error("Error al borrar la tarea");
				console.log("Tarea eliminada exitosamente");
				loadMauSonTodo(userName);
			})
			.catch((error) => {
				console.error("Error al borrar la tarea:", error);
			});
	};

	// Función para crear una nueva tarea
	const createTodossApi = (userName, taskLabel, isDone = false) => {
		console.log("Creando nuevas tareas:", userName)

		// Configuro el body del request
		const raw = JSON.stringify({
			label: taskLabel,
			is_Done: isDone,
		});

		//configuro las opciones de la solicitud
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: raw,
			redirect: "follow",
		};

		fetch(`https://playground.4geeks.com/todo/todos/${userName}`, requestOptions)
			.then((response) => {
				if (!response.ok) throw new Error("Error al crear la tarea");
				return response.json();
			})
			.then((data) => {
				console.log("Tarea creada exitosamente:", data);
				loadMauSonTodo(userName); // Recargo las tareas del usuario
			})
			.catch((error) => {
				console.error("Error al crear la tarea:", error);
			});
	};

	const clearAllTasks = (tasks, userName) => {
		console.log(`Borrando todas las tareas para el usuario: ${userName}...`);
	
		if (!tasks || tasks.length === 0) {
			console.error("No hay tareas para eliminar.");
			return;
		}
		//Mapeo las tareas y llamo a la función borrar tarea para cada una de ellas
		tasks.forEach(task => {
			deleteTodoApi(task.id, userName)
		});
		setTasks([]);
	};

	return (
		<>
			<TaskList users={users} selectedUser={selectedUser} tasks={tasks} setTasks={setTasks} borrarTarea={deleteTodoApi}
			crearTarea={createTodossApi} clearAll={clearAllTasks}/>
		</>
	)
};

export default Home;