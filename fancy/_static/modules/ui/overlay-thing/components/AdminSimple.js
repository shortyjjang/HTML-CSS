import React from 'react';


const AdminSimple = ({ thing }) =>
    <div className="wrapper admin-user-frm">
        <h3 className="stit">Admin</h3>
        <dl>
            <dt>Date published</dt>
            <dd>
                <label>{thing.date_published}</label>
            </dd>
        </dl>
    </div>;

export default AdminSimple;
