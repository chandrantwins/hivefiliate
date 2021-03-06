import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'

import DatePicker from "react-datepicker"
import moment from 'moment'

import Paginations from '../../../include/paginations'
import {Spinning} from '../../../include/circlespin'
import EntryList from '../../../include/showentries'
import {windowReload,Public_URL} from '../../../include/merchant_redirect'

import axios from 'axios'
export default function Payment(props) {

	 /* List with paginations
    ---------------------------------------------*/
    const [spinner,setspinner] = useState(false);
    const [search, setsearch]  = useState({
        date_from:'',
        date_to:'',
    });


    const [mindateTo, setmindateTo] = useState(null);
    function setFromDate(date){
        var fromdate                = moment(new Date(date)).format('MM/DD/YYYY');
        fromdate                    = new Date(fromdate);
        var todate                  = moment(new Date(fromdate)).add(1, 'days').format('MM/DD/YYYY');
        setmindateTo(new Date(todate));
        setsearch({...search,date_from:new Date(fromdate),date_to:new Date(todate)});
    }

    const [list, setlist] = useState([]);
    const [pagenumber, setpagenumber] = useState(1);
    const [totaldata, settotaldata] = useState(0);
    const [entry, setentry] = useState(0);
    const [entrytype, setentrytype] = useState('');

    const [paginations, setpaginations] = useState({
        paginations:[{
        listnav:[],
        pageinfo:'',
        limit_page:'',
        total_page:'',
        total_records:'',
        current_page:'',
        startPage:'',
        endPage:'',
        ellipseLeft:'',
        ellipseRight:'',
        }]
    });

	function pagenumberfunction(page){
        TableList(page,search);
    }

    function TableList(page,searchstr){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','affiliates_paymentpaid');
        formData.append('search',JSON.stringify(searchstr));
        formData.append('page',page);
        axios.post('/affiliates/payment/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setentry(obj.entries.val);
            setentrytype(obj.entries.type);
            setlist(obj.listtable);
            setpaginations(obj.paginations);
            settotaldata(obj.paginations.paginations.total_records);
            setspinner(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    /* Search */
    function SearchProcess(){
        const searchvalue = {
            date_from:moment(new Date(search.date_from)).format('YYYY-MM-DD'),
            date_to:moment(new Date(search.date_to)).format('YYYY-MM-DD'),
        }
        TableList(pagenumber,searchvalue);
    }


	/* Setup modal Component */
    const [isoff, setisoff] = useState('off');
    function reloadEntries(){
        TableList(pagenumber,search);
    }


    useEffect(()=>{
        TableList(pagenumber,search);
    },[]);

	return (
		<React.Fragment>
	        <div className="orders pagecontent">


                    <div className="searchtable">
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <div className="date-wrapper">
                                        <DatePicker
                                            selected={search.date_from}
                                            onChange={date => setFromDate(date)}
                                            placeholderText="Date From"/>
                                    </div>
                                </Form.Field>
                                <Form.Field>
                                        <div className="date-wrapper">
                                            <DatePicker
                                                selected={search.date_to}
                                                minDate={mindateTo}
                                                onChange={date => setsearch({...search,date_to:date})}
                                                placeholderText="Date To"/>
                                        </div>
                                </Form.Field>
                                <Form.Field>
                                    <Button className="blue" onClick={()=>SearchProcess()} icon labelPosition='left'>Search<Icon name='search' /></Button>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </div>

					          <div className="table-wrapper">
                        {spinner&&Spinning()}
                        <div className="table-button">
                            <div className="columns is-mobile is-vcentered">
                            <div className="column is-one-third"><div className="entries-container">{entry>0&&<EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={reloadEntries}/>}</div></div>
                            <div className="column">
                                <div className="position-right">
                                    <Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh'/> Refresh</Button>
                                </div>
                            </div>
                            </div>
                        </div>
						        <div className="table-responsive">
                    <Table celled selectable compact>
    								<Table.Header>
    									<Table.Row>
    										<Table.HeaderCell>Payment Date</Table.HeaderCell>
                        <Table.HeaderCell>Invoice for month</Table.HeaderCell>
                        <Table.HeaderCell>Invoice Number</Table.HeaderCell>
    										<Table.HeaderCell>Paid Earnings</Table.HeaderCell>
    										<Table.HeaderCell>Comments</Table.HeaderCell>
    									</Table.Row>
    								</Table.Header>
    								<Table.Body>
                    {list.length==0&&<Table.Row negative><Table.Cell  colSpan='5' textAlign="center">No record found</Table.Cell></Table.Row>}
			              {list.map(function(data, key){
                    return <Table.Row key={key}>
                            <Table.Cell>{data.payment_date}</Table.Cell>
                            <Table.Cell>{data.month_invoice}</Table.Cell>
                            <Table.Cell>{data.invoice_number}</Table.Cell>
                            <Table.Cell>{data.paid_sum}</Table.Cell>
                            <Table.Cell>{data.comments}</Table.Cell>
                        </Table.Row>
                        })}
                    </Table.Body>
                      {list.length>0&&
                      <Table.Footer fullWidth>
                          <Table.Row>
                          <Table.HeaderCell colSpan='5'>
                              <div className="dash-footer"><Paginations callbackPagination={paginations} callbackPagenumber={pagenumberfunction}/></div>
                          </Table.HeaderCell>
                          </Table.Row>
                      </Table.Footer>
                      }
              	     </Table>
                  </div>
					      </div>
            </div>

		</React.Fragment>
	)
}
