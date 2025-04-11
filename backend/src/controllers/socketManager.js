import { Server } from "socket.io";

let connections = {}; // Har call ka user store karne ke liye
let messages = {}; // Har call ki chat history store karne ke liye
let timeOnline = {}; // Har user ka online time track karne ke liye


export const connectToSocket = (server) => {
    const io = new Server(server , {
        cors: {
            origin: "*",
            methods: ["GET","POST"],
            allowedHeaders: ["*"] ,
            credentials: true
        }
    }) ;

    io.on("connection" , (socket) => {

        console.log("connected");

        socket.on("join-call" , (path) => {

            if(connections[path] === undefined){
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // connections[path].forEach(elem => {
                // io.to(elem)
                // })

            for(let a=0;a < connections[path].length;a++){ 
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
            }

            if(messages[path] !== undefined){
                for(let a=0;a<messages[path].length;++a){
                    io.to(socket.id).emit("chat-messages", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender']
                    )
                }
            }
        })

        socket.on("signal" , (toId,message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom , found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey , roomValue]) => {

                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey , true] ;
                }

                return [room, isFound];
            }, ['', false]) ; 

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({'sender':sender , 'data':data ,'socket-id-sender':socket.id })
                console.log("message" , matchingRoom , ":" , sender , data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message" , data , sender , socket.id)
                })
            }
        })

        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key 

            for( const[k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){//k is room here and v = no. of persons in the room 
                for(let a=0;a <v.length ;++a){
                    if(v[a] === socket.id){
                        key = k

                        for(let a=0 ;a < connections[key].length ; ++a){
                            io.to(connections[key][a]).emit('user-left' , socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index , 1)

                        if(connections[key] === 0){
                            delete connections[key]
                        }
                    }
                }
            }

        })
    })
    return io ;
}

//another code for socket.io for simple understanding

// import { Server } from "socket.io";

// let connections = {}; // Store users per call
// let messages = {}; // Store chat history per call
// let timeOnline = {}; // Track user online time

// export const connectToSocket = (server) => {
//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"],
//             allowedHeaders: ["*"],
//             credentials: true
//         }
//     });

//     io.on("connection", (socket) => {
//         socket.on("join-call", (room) => {
//             if (!connections[room]) connections[room] = [];
            
//             connections[room].push(socket.id);
//             timeOnline[socket.id] = new Date();
            
//             // Notify other users in the room
//             connections[room].forEach(user => {
//                 io.to(user).emit("user-joined", socket.id, connections[room]);
//             });
            
//             // Send previous chat messages to the new user
//             if (messages[room]) {
//                 messages[room].forEach(msg => {
//                     io.to(socket.id).emit("chat-messages", msg.data, msg.sender, msg["socket-id-sender"]);
//                 });
//             }
//         });

//         socket.on("signal", (toId, message) => {
//             io.to(toId).emit("signal", socket.id, message);
//         });

//         socket.on("chat-message", (data, sender) => {
//             const room = Object.keys(connections).find(room => connections[room].includes(socket.id));
//             if (!room) return;

//             if (!messages[room]) messages[room] = [];
//             messages[room].push({ sender, data, "socket-id-sender": socket.id });
            
//             // Broadcast message to all users in the room
//             connections[room].forEach(user => {
//                 io.to(user).emit("chat-message", data, sender, socket.id);
//             });
//         });

//         socket.on("disconnect", () => {
//             const room = Object.keys(connections).find(room => connections[room].includes(socket.id));
//             if (!room) return;
            
//             // Notify others that the user left
//             connections[room].forEach(user => {
//                 io.to(user).emit("user-left", socket.id);
//             });
            
//             // Remove user from the room
//             connections[room] = connections[room].filter(user => user === socket.id);
            
//             // Delete room if empty
//             if (connections[room].length === 0) delete connections[room];
            
//             delete timeOnline[socket.id];
//         });
//     });

//     return io;
// };
