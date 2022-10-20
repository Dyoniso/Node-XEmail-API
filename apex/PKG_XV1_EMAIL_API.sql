create or replace package PKG_XV1_EMAIL_API as

    procedure SEND_EMAIL(l_receiver varchar2, l_subject varchar2, l_text varchar2, l_html varchar2);

end;

create or replace package body PKG_XV1_EMAIL_API as
    l_endpoint varchar2(200) := 'localhost';
    l_port number := 8081;
    l_send_path varchar2(30) := '/mail/send';
    l_api_key varchar(200) := 'your-api-key';

    function GET_URL return varchar2 as
    begin
        return l_endpoint || ':' || l_port;
    end;

    function GET_SEND_URL return varchar2 as
    begin
        return GET_URL || l_send_path;
    end;

    procedure INIT_DEFAULT_HEADER is
        hashed_key varchar2(400);
    begin
        SELECT standard_hash(l_api_key, 'MD5') INTO hashed_key FROM dual;

        apex_web_service.set_request_headers(
            p_name_01   =>      'X-API-KEY',
            p_value_01  =>      hashed_key,
            p_name_02   =>      'Content-Type',
            p_value_02  =>      'application/json'
        );

    end INIT_DEFAULT_HEADER;

    procedure SEND_EMAIL(l_receiver varchar2, l_subject varchar2, l_text varchar2, l_html varchar2) 
    is
        v_res clob;
        v_json varchar2(4000);
    begin
        apex_json.initialize_clob_output;
        apex_json.open_object;
        apex_json.write('receiver', l_receiver);
        apex_json.write('subject', l_subject);
        apex_json.write('text', l_text);
        apex_json.write('html', l_html);
        apex_json.close_object;

        v_json := apex_json.get_clob_output;
        apex_json.free_output;

        INIT_DEFAULT_HEADER;

        v_res := apex_web_service.make_rest_request(
           p_url               => GET_SEND_URL,
           p_http_method       => 'POST',
           p_body              => v_json
        );

        DBMS_OUTPUT.PUT_LINE('[Email-Request] ' || v_res);
    end;
end;