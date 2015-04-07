<?php
	if(!$_POST) exit;
	
	//PHP Mailer
	require_once(dirname(__FILE__)."/layout/plugins/phpmailer/class.phpmailer.php");
	
	///////////////////////////////////////////////////////////////////////////

		//Enter name & email address that you want to emails to be sent to.
		
		$toName = "Artemis";
		$toAddress = "email@sitename.com";
		
	///////////////////////////////////////////////////////////////////////////
	
	//Only edit below this line if either instructed to do so by the author or have extensive PHP knowledge.
	
	//Form Fields
	$name = $_POST["name"];
	$email = $_POST["email"];
	$message = $_POST["message"];	
		
	//Send message via E-mail
	if(get_magic_quotes_gpc()) {
		$message = stripslashes($message);
	}
	
	$email_subject = "Contact Support";
	
	$email_body = "<p>You have been contacted by <b>".$name."</b>. The message is as follows.</p>
					<p>----------</p>
					<p>".preg_replace("/[\r\n]/i", "<br />", $message)."</p>
					<p>----------</p>
					<p>
						E-mail Address: <a href=\"mailto:".$email."\">".$email."</a>
					</p>";
	
	$objmail = new PHPMailer();
	
	//Use this line if you want to use PHP mail function
	$objmail->IsMail();
	
	//Use the codes below if you want to use SMTP mail
	/*			
	$objmail->IsSMTP();		
	$objmail->SMTPAuth = true;
	$objmail->Host = "mail.yourdomain.com";
	$objmail->Port = 587;	//You can remove that line if you don't need to set the SMTP port
	$objmail->Username = "example@yourdomain.com";
	$objmail->Password = "email_address_password";
	*/
	
	$objmail->From = $email;
	$objmail->FromName = $name;
	$objmail->AddAddress($toAddress, $toName);	
	$objmail->AddReplyTo($email, $name);
	$objmail->Subject = $email_subject;
	$objmail->MsgHTML($email_body);
	if(!$objmail->Send()) {
		$error = "Message sending error: ".$objmail->ErrorInfo;
	}
?>