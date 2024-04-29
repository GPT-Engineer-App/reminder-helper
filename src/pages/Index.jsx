import React, { useState, useEffect } from "react";
import { Box, Button, Input, List, ListItem, Text, VStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const result = await client.getWithPrefix("todo:");
    if (result) {
      setTodos(result.map((item) => ({ id: item.key, ...item.value })));
    }
  };

  const addTodo = async () => {
    if (input.trim() === "") {
      toast({
        title: "No content",
        description: "You can't add an empty todo!",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const newTodo = { text: input, completed: false };
    const key = `todo:${Date.now()}`;
    const success = await client.set(key, newTodo);
    if (success) {
      setTodos([...todos, { id: key, ...newTodo }]);
      setInput("");
    }
  };

  const deleteTodo = async (id) => {
    const success = await client.delete(id);
    if (success) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <VStack p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Todo List
      </Text>
      <Box minW="300px">
        <Input placeholder="Add a new todo" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addTodo()} />
        <IconButton icon={<FaPlus />} onClick={addTodo} colorScheme="blue" aria-label="Add todo" ml={2} />
      </Box>
      <List spacing={3} w="100%">
        {todos.map((todo) => (
          <ListItem key={todo.id} d="flex" justifyContent="space-between" alignItems="center">
            <Text as={todo.completed ? "s" : ""}>{todo.text}</Text>
            <IconButton icon={<FaTrash />} onClick={() => deleteTodo(todo.id)} colorScheme="red" aria-label="Delete todo" />
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default Index;
