BEGIN
    PKG_XV1_EMAIL_API.SEND_EMAIL(
        l_receiver => 'example@gmail.com',
        l_subject => 'Awesome email written in Node',
        l_text => 'Very easy!',
        l_html => '<h1> Strong Email </h1>'
    );
END;