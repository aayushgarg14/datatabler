import React, { Component, Fragment } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button'
import { Pagination } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Table from "../../components/Table";
import "./styles.css";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/Input";
import Modal from '../../components/Modal';
import Dropdown from "../../components/Dropdown";

let types = [
    { value: 'Face Cleansers', label: 'Face Cleansers' },
    { value: 'Toner and Mists', label: 'Toner and Mists' },
    { value: 'Eye Care', label: 'Eye Care' }
];

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headers: ["id", "Name", "Amount(each)", "Type", "Stock Remaining", "Description", ""],
            data: [],
            axios: false,
            create: false,
            edit: false,
            deleteRow: false,
            selectUserType: null,
            show: false,
            name: '',
            quantity: '',
            amount: '',
            description: '',
            id: '',
            activePage: 1,
            pagination: {},
            getUrl: '/api/products',
            radio: 'all',
            typeSelected: null
        };

        this.updateInputHandler = this.updateInputHandler.bind(this)
        this.onEditDetails = this.onEditDetails.bind(this)
        this.onDeleteProduct = this.onDeleteProduct.bind(this)
        this.onCreateProduct = this.onCreateProduct.bind(this)
        this.onProductManipulate = this.onProductManipulate.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)
        this.pageChangeHandler = this.pageChangeHandler.bind(this)
        this.selectRadioHandler = this.selectRadioHandler.bind(this)
        this.changeDropDownHandler = this.changeDropDownHandler.bind(this)
    }

    componentDidMount() {
        this.setState({
            axios: true
        });
        this.getProductsList()
    }

    selectRadioHandler(e) {
        const value = e.target.value
        let getUrl = `/api/products?type=${value}`
        if (value === 'all') {
            getUrl = '/api/products'
        }
        this.setState({
            radio: value,
            getUrl,
        }, this.getProductsList)
    }

    changeDropDownHandler(typeSelected) {
        this.setState({ typeSelected });
    }

    getProductsList() {        
        axios.get(this.state.getUrl).then(response => {
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
        let getUrl = `/api/products?page=${number}`
        if(this.state.radio !== 'all' && this.state.radio !== '') {
            getUrl = `/api/products?page=${number}&type=${this.state.radio}`
        }
        this.setState({ getUrl }, this.getProductsList)
    }

    onEditDetails(id) {
        const { data } = this.state
        var dataEach = data.find(each => {
            return each.id === id
        });
        const typeSelected = { value: dataEach.type, label: dataEach.type }
        this.setState({
            id,
            name: dataEach.name,
            amount: dataEach.amount,
            typeSelected,
            description: dataEach.description,
            quantity: dataEach.quantity,
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
        const { name, amount, typeSelected, quantity, description, id } = this.state
        let data = {}

        switch (type) {
            case 'create':
                data = {
                    name, amount, type: typeSelected.label, quantity, description
                }
                axios.post('/api/products', data).then(response => {
                    if (response.data === 'Product created!') {
                        toast.success(response.data)
                        this.getProductsList()
                    } else {
                        toast.error('Some error occured!')
                    }
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            case 'edit':
                data = {
                    name, amount, type: typeSelected.label, quantity, description
                }
                axios.put(`/api/products/${id}`, data).then(response => {                    
                    if (response.data === 'Product Updated Successfully!!!') {
                        toast.success(response.data)
                        this.getProductsList()
                    }
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            case 'delete':
                axios.delete(`/api/products/${id}`).then(response => {
                    if (response.data === 'Product Deleted Successfully!!!') {
                        toast.success(response.data)
                        this.getProductsList()
                    }
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
        const { name, amount, typeSelected, description, quantity, show } = this.state
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
                                placeholder="Amount(per piece) in USD"
                                value={amount}
                                onChange={(val) => this.updateInputHandler('amount', val)} />
                            <Dropdown
                                placeholder="Type of Product"
                                value={typeSelected}
                                onChangeHandler={this.changeDropDownHandler}
                                options={types} />
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

        return (
            <div className="Container">
                <ToastContainer />
                <div className="ButtonContainer">
                    <div className="UpperContainer">
                        <div className="UpperQues">
                            <div className="InnerText">Filter</div>
                        </div>
                        <div className="UpperRadio" onChange={this.selectRadioHandler}>
                            <div className="pretty p-default p-curve">
                                <input value="Face Cleansers" type="radio" name="radio1" />
                                <div className="state p-primary-o">
                                    <label className="RadioText">Face Cleansers</label>
                                </div>
                            </div>
                            <div className="pretty p-default p-curve">
                                <input value="Toner and Mists" type="radio" name="radio1" />
                                <div className="state p-primary-o">
                                    <label className="RadioText">Toner and Mists</label>
                                </div>
                            </div>
                            <div className="pretty p-default p-curve">
                                <input value="Eye Care" type="radio" name="radio1" />
                                <div className="state p-primary-o">
                                    <label className="RadioText">Eye Care</label>
                                </div>
                            </div>
                            <div className="pretty p-default p-curve">
                                <input value="all" type="radio" name="radio1" />
                                <div className="state p-primary-o">
                                    <label className="RadioText">All</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={this.onCreateProduct}
                        variant="contained"
                        color="default"
                        className="button">
                        Create User
                        </Button>
                </div>
                {!axios
                    ? (
                        <Fragment>
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
                        </Fragment>
                    )
                    : (
                        <div className="SpinnerContainer">
                            <Spinner />
                        </div>
                    )
                }
                <div className="Pagination">
                    {this.pagination()}
                </div>
                {this.renderModal(type)}
            </div>

        );
    }
}

export default Products;