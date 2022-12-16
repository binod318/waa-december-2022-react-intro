import { Space, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleError, handleSuccess } from '../../utilities';
import './categories.css';
import AddCategory from './components/add-form';
import collapse from '../../images/collapse.png';
import expand from '../../images/expand.png';
import edit from '../../images/edit.png';
import deleteIcon from '../../images/delete.png';
import { setReload } from '../../redux/categoryReducer';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { setErrorMessage, setSuccessMessage } from '../../redux/appReducer';

function Categories() {
    const [addFormVisible, setAddFormVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});

    const { categories, reloadData } = useSelector(state => state.categoryReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        if (reloadData) {
            dispatch(getCategories());
            setSelectedCategory({});
            setAddFormVisible(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadData]);

    useEffect(() => {
        //componentWillUnmount();
        return ()=> {
            dispatch(setErrorMessage(''));
            dispatch(setSuccessMessage(''));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleForm = function () {
        setAddFormVisible(!addFormVisible);
    }

    const editClick = function (id) {
        const row = categories.find(o => o.id === id);
        setSelectedCategory(row)
        setAddFormVisible(true);
    }

    const deleteClick = function (id) {
        if (window.confirm('Are you sure you want to delete?')) {
            axios.delete('/categories/' + id)
                .then((result) => {
                    handleSuccess('Category deleted successfully!', dispatch);
                    dispatch(setReload(true));
                })
                .catch(error => handleError(error, dispatch));
        }

    }

    // Sample Columns data
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Category name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <img src={edit} alt="edit" height="16px" onClick={() => editClick(record.id)} />
                    <img src={deleteIcon} alt="delete" height="16px" onClick={() => deleteClick(record.id)} />
                    <Link to={`/categories/${record.id}/products`} className='link-product'>products</Link>
                </Space>
            )
        }
    ];

    return (
        <div className='categories'>
            <label className='h4'>Categories</label>
            <img src={addFormVisible ? collapse : expand} alt="toggle" width="20px" onClick={toggleForm} />
            {addFormVisible && <AddCategory data={selectedCategory} />}
            <Table dataSource={categories} columns={columns} rowKey="id" />
        </div>
    );
}

export default Categories;