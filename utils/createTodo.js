import { v4 as uuid } from 'uuid'

const createTodo = (
  task,
  deadline
) => {
  return {
    id: uuid(),
    task: task,
    deadline: deadline,
  }
}

export default createTodo