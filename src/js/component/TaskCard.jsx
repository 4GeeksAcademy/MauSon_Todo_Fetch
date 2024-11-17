import React from "react";

const TaskCard = ({ task, index, delTask }) => {
    return (
        <li className="list-group-item d-flex justify-content-between px-2">
            <p className="mb-0">{task}</p>
            <span
                className="del-icon text-danger"
                onClick={() => delTask(index)}
                role="button"
            >
                &#10006;
            </span>
        </li>
    );
};

export default TaskCard;