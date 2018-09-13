import React, { Component, Fragment } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button'
import { Pagination } from 'react-bootstrap'

import Table from "../../components/Table";
import "./styles.css";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/Input";
import Modal from '../../components/Modal';

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headers: ["id", "Name", "Quantity", "Description", ""],
            data: [],
            axios: false,
            create: false,
            edit: false,
            deleteRow: false,
            selectUserType: null,
            show: false,
            name: '',
            quantity: '',
            description: '',
            id: '',
            activePage: 1,
            pagination: {},
            getUrl: '/api/products'
        };

        this.updateInputHandler = this.updateInputHandler.bind(this)
        this.onEditDetails = this.onEditDetails.bind(this)
        this.onDeleteProduct = this.onDeleteProduct.bind(this)
        this.onCreateProduct = this.onCreateProduct.bind(this)
        this.onProductManipulate = this.onProductManipulate.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)
        this.pageChangeHandler = this.pageChangeHandler.bind(this)
    }

    componentDidMount() {
        this.setState({
            axios: true
        });
        this.getProductsList()
    }

    getProductsList() {
        console.log(this.state.getUrl);

        axios.get(this.state.getUrl).then(response => {
            console.log(response);

            let data = [];
            data.push.apply(data, response.data.data.data);
            this.setState({
                data,
                pagination: response.data.pagination,
                axios: false
            });
        }).catch(err => {
            console.log(err.response);

            this.setState({
                axios: false
            })
        })
    }

    updateInputHandler(key, event) {
        var partialState = {};
        partialState[key] = event.target.value;
        this.setState(partialState);
    }

    pageChangeHandler(number) {
        console.log(number);
        this.setState({ getUrl: `/api/products?page=${number}` }, this.getProductsList)
    }

    onEditDetails(id) {
        const data = this.state.data[id - 1]
        this.setState({
            id,
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            show: true,
            edit: true
        })
    }

    onDeleteProduct(id) {
        this.setState({ id, show: true, deleteRow: true })
    }

    onCreateProduct() {
        this.setState({ show: true, create: true })
    }

    onProductManipulate(type) {
        const { name, quantity, description, id } = this.state
        let data = {
            name, quantity, description
        }
        switch (type) {
            case 'create':

                axios.post('/api/products', data).then(response => {
                    console.log(response);
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            case 'edit':
                axios.put(`/api/products/${id}`, data).then(response => {
                    console.log(response);
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            case 'delete':
                axios.delete(`/api/products/${id}`).then(response => {
                    console.log(response);
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            default:
                break;
        }
        this.setState({ show: false, edit: false, create: false, deleteRow: false })
    }

    onCloseModal() {
        this.setState({ show: false, edit: false, create: false, deleteRow: false })
    }

    pagination() {
        const { pagination } = this.state
        if (pagination.current_page) {
            let active = pagination.current_page;
            let items = [];
            for (let number = 1; number <= pagination.last_page; number++) {
                items.push(
                    <Pagination.Item key={number} onClick={() => this.pageChangeHandler(number)} active={number === active}>{number}</Pagination.Item>
                );
            }

            return (
                <div>
                    <Pagination bsSize="medium">{items}</Pagination>
                </div>
            );
        }
    }

    renderModal(type) {
        const { name, description, quantity, show } = this.state
        return (
            <Modal show={show}>
                <div className="InputForm">
                    {type === 'delete'
                        ? <div>Are you sure you want to delete?</div>
                        : <Fragment>
                            <TextInput
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(val) => this.updateInputHandler('name', val)} />
                            <TextInput
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(val) => this.updateInputHandler('quantity', val)} />
                            <TextInput
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(val) => this.updateInputHandler('description', val)} />
                        </Fragment>
                    }
                    <div className="FormButton">
                        <div className="FormButtonEach">
                            <Button variant="contained" onClick={() => this.onProductManipulate(type)}>
                                {type === 'create'
                                    ? 'Create'
                                    : type === 'edit'
                                        ? 'Edit'
                                        : 'Delete'
                                }
                            </Button>
                        </div>
                        <div className="FormButtonEach">
                            <Button variant="contained" onClick={this.onCloseModal}>
                                Cancel
                        </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    render() {
        const { headers, data, axios, create, edit } = this.state;
        const type = create
            ? 'create'
            : edit
                ? 'edit'
                : 'delete'

        return !axios
            ? (
                <div className="Container">
                    <div className="ButtonContainer">
                        <Button
                            onClick={this.onCreateProduct}
                            variant="contained"
                            color="default"
                            className="button">
                            Create User
                        </Button>
                    </div>
                    <div className="MainContainer">
                        {!data.length
                            ? <div className="NoProducts">No Products To Display!!!</div>
                            : <div className="TableList">
                                <Table
                                    headers={headers}
                                    data={data}
                                    onEditDetails={this.onEditDetails}
                                    onDeleteProduct={this.onDeleteProduct} />
                            </div>
                        }
                    </div>
                    <div className="Pagination">
                        {this.pagination()}
                    </div>
                    {this.renderModal(type)}
                </div>
            )
            : (
                <div className="SpinnerContainer">
                    <Spinner />
                </div>
            );
    }
}

export default Products;