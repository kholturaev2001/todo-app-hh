import { Input, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

const EditModal = ({
  editInp,
  setEditInp,
  editTodoFn,
  onCancel,
  isModalOpen,
}) => {
  const handleSelectChange = (value) => {
    setEditInp({
      ...editInp,
      status: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditInp({
      ...editInp,
      [name]: value,
    });
  };
  return (
    <Modal
      onOk={editTodoFn}
      onCancel={onCancel}
      open={isModalOpen}
      okText="Изменить"
      cancelText="Отмена"
    >
      <section className="pt-3 rounded-md">
      <p className="text-center text-base font-semibold my-1">Изменение задачи</p>
        <Input
          className="border border-[gray]  h-10 text-lg"
          type="text"
          name="title"
          placeholder="Заголовок"
          value={editInp.title}
          onChange={handleInputChange}
        />
        <div className="flex my-5">
          <TextArea
            className="border border-[gray]  h-10 text-lg"
            type="text"
            name="description"
            placeholder="Описание"
            value={editInp.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <p>Cтатус: </p>
          <Select
            className="w-[70%] "
            value={editInp.status}
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
      </section>
    </Modal>
  );
};

export default EditModal;
