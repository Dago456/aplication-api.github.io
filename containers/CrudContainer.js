import { useEffect, useState } from "react";
import axios from "axios";

import { Table, Col, Row, Button, Modal, Input } from "antd";
const { TextArea } = Input;

const CrudContainer = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const showModal = () => {
    setOpenModal(true);
    resetForm();
    setOpenModal(true);
  };
  const handleOk = () => {
    setOpenModal(false);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  const fetchData = async () => {
    const response = await axios.get("https://company-class-api.dago456.repl.co");
    setData(response.data);
  };
  
  const handlePost = async () => {
    const response = await axios.post("https://company-class-api.dago456.repl.co", form);
    if (response.status === 200) {
      alert(response.data.message);
    } else {
      alert("El producto no se ha creado");
    }
    console.log("response post", response);
    setOpenModal(false);
    fetchData();
  };

  const handleEdit = (record) => {
    setForm(record);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    const response = await axios.put(
      `https://company-class-api.dago456.repl.co${form.id}`,
      form
    );
    if (response.status === 200) {
      alert(response.data.message);
    } else {
      alert("El producto no se ha actualizado");
    }
    console.log("response put", response);
    setOpenModal(false);
    fetchData();
  };
  
  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (!confirmed) {
      return; 
    }
    const response = await axios.delete(`https://company-class-api.dago456.repl.co${id}`);
    if (response.status === 200) {
      alert(response.data.message);
    } else {
      alert('El producto no se ha eliminado');
    }
    fetchData();
  };
  
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Descripcion",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Editar",
      dataIndex: "",
      key: "x",
      render: (record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Editar
        </Button>
      ),
    },
    {
      title: "Eliminar",
      dataIndex: "",
      key: "y",
      render: (record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.id)}>
          Eliminar
        </Button>
      ),
    },
  ];

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
    });
  };

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <h1>Navegacion dentro de la base de datos</h1>
          <Button type="primary" onClick={showModal}>
            Crear
          </Button>
          <Table rowKey={"id"} dataSource={data} columns={columns} />
        </Col>
      </Row>

      <Modal
        title={form.id ? "Editar producto" : "Crear producto"}
        open={openModal}
        onOk={form.id ? handleUpdate : handlePost}
        onCancel={() => setOpenModal(false)}
      >
        <p>Nombre:</p>
        <Input
          onChange={handleChange}
          name="name"
          placeholder="Nombre del producto"
          value={form && form.name}
        />
        <p>valor:</p>
        <Input
          onChange={handleChange}
          name="price"
          placeholder="Precio del producto"
          value={form && form.price}
        />
        <p>caracteristicas:</p>
        <TextArea
          onChange={handleChange}
          name="description"
          value={form && form.description}
          placeholder="Descripcion del producto"
          rows={4}
          maxLength={25}
        />
      </Modal>
    </>
  );
};

export default CrudContainer;
