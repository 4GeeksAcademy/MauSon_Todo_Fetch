import React, { useEffect, useState } from "react";
import { FaTrashCan, FaUserPlus } from "react-icons/fa6";

const TaskList = ({ tasks, setTasks, borrarTarea, crearTarea, selectedUser, clearAll }) => {
    const [inputValue, setInputValue] = useState(""); // estado para el input
    const [completed, setCompleted] = useState(0); //estado para tareas realizadas
    const [pending, setPending] = useState(0); // estado para tareas pendientes

    //Función para actualizar los contadores de las funciones pendientes y realizadas.
    const updateTaskState = () => {
        const completedCount = tasks.filter((task) => task.is_done).length;
        const pendingCounts = tasks.filter((task) => !task.is_done).length;
        setCompleted(completedCount);
        setPending(pendingCounts);
    }

    //Actualiza el contador de tareas pendientes cada vez se modifica una tarea
    useEffect(() => {
        updateTaskState();
    }, [tasks]);

    // Función para manejar el cambio de estado del checkbox
    const handleCheckboxChange = (taskId) => {

        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, is_done: !task.is_done }; // Alternar estado "is_done"
            }
            return task;
        });
        setTasks(updatedTasks); // Actualizar el estado de las tareas
    };

    //Manejar cambios el campo de entrada
    const handleChange = (e) => {
        setInputValue(e.target.value)
    };

    //Enviar texto al persionar la tecla "enter"
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue !== "") {
            crearTarea(selectedUser.name, inputValue);
            setInputValue("");
        }
    }

    return (
        <div className="container">
            <div className="card-header d-flex align-items-center justify-content-between">
                <div className="mt-4">
                    <h1>Contact List MauSon</h1>
                </div>
                <div className="clear-all-container d-flex gap-2">
                    <button
                        className="circle-button circle-button-red"
                        onClick={() => clearAll(tasks, selectedUser?.name)}
                    >
                        <FaTrashCan />
                    </button>
                </div>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Escribe tu tarea aquí..."
                    className="form-control"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <div className="task-counters d-flex justify-content-between mt-2">
                <span>
                        <strong>Tareas Pendientes:</strong> {pending}
                    </span>
                    <span>
                        <strong>Tareas Completadas:</strong> {completed}
                    </span>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12">
                    <div className="card card-white">
                        <div className="card-body">
                            <div className="todo-list">
                                {tasks.length === 0 ? (
                                    // Mostrar este mensaje si no hay tareas
                                    <div className="text-center text-muted">No hay tareas pendientes...</div>
                                ) : (
                                    // Renderizar las tareas si existen
                                    tasks.map((task, index) => (
                                        <div
                                            className="todo-item d-flex align-items-center justify-content-between position-relative"
                                            key={index}
                                            onClick={() => handleCheckboxChange(task.id)} //Maneja el click en todo el contenedor
                                        >
                                            {/* Checkbox */}
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    checked={task.is_done}
                                                    onChange={() => {}} // El cambio se maneja en el div todo-item
                                                />
                                                {/* Texto del checkbox */}
                                                <span className={task.is_done ? "text-completed" : ""}>
                                                    {task.label}
                                                </span>
                                            </div>

                                            {/* Ícono de borrar */}
                                            <div className="delete-icon">
                                                <FaTrashCan
                                                    className="delete-icon-task"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // evita que click en el icono afecte el contenedor
                                                        borrarTarea(task.id, selectedUser.name)}}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskList;