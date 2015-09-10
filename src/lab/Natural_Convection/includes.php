<!--
Developed under a Research grant from NMEICT, MHRD
by
Amrita CREATE (Center for Research in Advanced Technologies for Education),
VALUE (Virtual Amrita Laboratories Universalizing Education)
Amrita University, India 2009 - 2013
http://www.amrita.edu/create
-->

<link  href="template/vlab_resp/css/controlStyles.css" rel="stylesheet" type="text/css" />
<link  href="<?php getSimCss('simstyle.css'); ?>" rel="stylesheet" type="text/css" />
<script src="template/vlab_resp/js/jquery-ui-1.8.17.custom.min.js" language="javascript"></script>
<script src="template/vlab_resp/js/createjs-2013.12.12.min.js"></script>

<?php 
	$language=$_GET['elink_lan'];
	$locale = array("en-IN","ml-IN","hi-IN");
	if (!in_array($language, $locale)){
		$language = $locale[0];
	}
		
?>
<link rel="gettext" type="application/x-po" href='<?php getSimPath(); ?>locale/<?php echo $language ?>/messages.po' />  
<script type="text/javascript" src="<?php getSimPath(); ?>js/Gettext.js"></script>
