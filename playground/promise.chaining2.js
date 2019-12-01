require('../src/db/mongoose')
const Task = require('../src/models/tasks')

// Task.findByIdAndDelete('5dda8e44d47efb211cf7c57d').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5dda75c71a542e03d4dddcae').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})