import {
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  Button,
  Input,
  Pagination,
  Select,
  Skeleton,
  Tag,
  notification,
} from "antd";
import { doc, setDoc } from "firebase/firestore";
import EditModal from "./EditModal";
import Bin from "../icons/Bin";
import EditIcon from "../icons/EditIcon";
import TextArea from "antd/es/input/TextArea";

const Todos = () => {
  const defaultInpValue = {
    title: "",
    description: "",
    status: "waiting",
  };
  const [todosData, setTodosData] = useState([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [inpValue, setInpValue] = useState(defaultInpValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editInp, setEditInp] = useState(defaultInpValue);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [current, setCurrent] = useState(1);

  function getData() {
    setTodosLoading(true);
    try {
      const collectionRef = collection(db, "todos");
      const queryRef = query(collectionRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTodosData(list.reverse());
        setTodosLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.log("Error", error.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function addTodo() {
    if (inpValue.title.trim() !== "") {
      setInpValue(defaultInpValue);
      try {
        const collectionRef = collection(db, "todos");
        await addDoc(collectionRef, {
          title: inpValue.title,
          description: inpValue.description,
          status: inpValue.status,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log("Error", error.message);
      }
    } else {
      notification["warning"]({
        message: "Внимание!",
        description: "Заголовок не должен быть пустым!",
      });
    }
  }

  async function deleteTodo(id) {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.log("Error", error.message);
    }
  }

  async function editTodoFn() {
    if (editInp.title.trim() !== "") {
      setIsModalOpen(false);
      setEditInp("");
      try {
        const docRef = doc(db, "todos", currentTodo.id);
        await setDoc(docRef, {
          ...currentTodo,
          title: editInp.title,
          description: editInp.description,
          status: editInp.status,
        });
        notification["success"]({
          message: "Изменено!",
          description: "Задача успешно изменена!",
        });
      } catch (error) {
        console.log("Error", error.message);
      }
    } else {
      notification["warning"]({
        message: "Внимание!",
        description: "Заголовок не должен быть пустым!",
      });
    }
  }

  const pageSize = 5;

  const pagOnchange = (page) => {
    setCurrent(page);
  };

  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedTodos = todosData?.slice(startIndex, endIndex);

  const handleSelectChange = (value) => {
    setInpValue({
      ...inpValue,
      status: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInpValue({
      ...inpValue,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="max-w-[650px] border border-gray rounded-md mt-10 mx-auto mb-[200px]">
        {todosLoading && (
          <div className="flex flex-col gap-5">
            <Skeleton active />
            <Skeleton active />
          </div>
        )}
        {!todosLoading && (
          <div>
            <div className="bg-[#F7F7F7] p-4 font-bold">
              <p className="text-lg">Список задач ({todosData.length} шт.)</p>
            </div>

            <div className="px-5">
              <section className="bg-gray-200 pt-3 px-2 rounded-md">
                <p className="text-center font-semibold my-1">Новая задача</p>
                <Input
                  className="border border-[gray]  h-10 text-lg"
                  type="text"
                  name="title"
                  placeholder="Заголовок"
                  value={inpValue.title}
                  onChange={handleInputChange}
                />
                <div className="flex my-5">
                  <TextArea
                    className="border border-[gray]  h-10 text-lg"
                    type="text"
                    name="description"
                    placeholder="Описание"
                    value={inpValue.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex md:flex-row flex-col items-center md:gap-0 gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-1 md:scale-100 scale-90">
                    <p>Cтатус: </p>
                    <Select
                      className="w-[80%] "
                      value={inpValue.status}
                      onChange={handleSelectChange}
                      options={[
                        {
                          value: "waiting",
                          label: "Ожидает выполнения",
                        },
                        {
                          value: "in_process",
                          label: "В процессе",
                        },
                        {
                          value: "completed",
                          label: "Выполнено",
                        },
                      ]}
                    />
                  </div>
                  <Button
                    className="bg-blue-500 rounded-md mx-auto text-white md:h-12 h-10"
                    onClick={addTodo}
                  >
                    Добавить
                  </Button>
                </div>
              </section>
              <div className="flex flex-col  border border-gray min-h-[350px]">
                {displayedTodos?.map((todo, id) => (
                  <div
                    key={todo.id}
                    className={` ${
                      id % 2 === 0 ? "bg-[#F7F7F7]" : ""
                    } flex flex-col items-center justify-between p-4`}
                  >
                    <p className="font-semibold text-lg text-start w-full">
                      {todo.title}
                    </p>
                    <p className=" text-sm text-start w-full">
                      {todo.description}
                    </p>
                    <div className="flex items-center justify-end w-full gap-2">
                      {todo.status && (
                        <Tag
                          color={
                            todo.status === "waiting"
                              ? `red`
                              : todo.status === "in_process"
                              ? "orange"
                              : "green"
                          }
                        >
                          {todo.status === "waiting"
                            ? "Ожидает выполнения"
                            : todo.status === "in_process"
                            ? "В процессе"
                            : "Выполнено"}
                        </Tag>
                      )}

                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setEditInp(todo);
                          setCurrentTodo(todo);
                        }}
                        className="bg-[#28A745] py-[5px] p-[10px] rounded-md"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="bg-[#DC3545] py-[5px] p-[10px] rounded-md"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Bin />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                current={current}
                onChange={pagOnchange}
                total={todosData.length}
                pageSize={pageSize}
                className="flex justify-center m-3"
              />
            </div>
          </div>
        )}
      </div>

      <EditModal
        editInp={editInp}
        isModalOpen={isModalOpen}
        setEditInp={setEditInp}
        editTodoFn={editTodoFn}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Todos;
