# Description: This MIQ Method will create a new Amazon EC2 instance
# from the criteria selected in the marketplace
# For use in Service/Provisioning/StateMachines/Methods/CreateEC2

require 'aws-sdk'
require 'net/http'
require 'uri/http'
require 'json'
#load 'order_status'

def send_order_status(status, order_id, information, message="")
  host = "jellyfish-core-dev.dpi.bah.com"
  path ="/order_items/#{order_id}/provision_update"
  url = "http://#{host}#{path}"
  uri = URI.parse(url)

  information = information.merge("provision_status" => status.downcase)
  information = information.merge("id" => "#{order_id}")
  $evm.log("info", "send_order_status: Information: #{information}")
  json = {
      "status" => "#{status}",
      "message" => "#{message}",
      "info" => information
  }
  $evm.log("info", "send_order_status: Information #{json.to_json}")
  begin
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Put.new(uri.path)
    request.content_type ="application/json"
    request.body = json.to_json
    response = http.request(request)
    $evm.log("info", "send_order_status: HTTP Response code: #{response.code}")
    $evm.log("info", "send_order_status: HTTP Response message: #{response.message}")
  rescue HTTPExceptions => e
    $evm.log("error", "send_order_status: HTTP Exception caught while sending response back to core: #{e.message}")
  rescue Exception => e
    $evm.log("error", "send_order_status: Exception caught while sending response back to core: #{e.message}")
  end
end # End of function

# Retrieve the information passed to MIQ from the Dialog call
access_key_id = "#{$evm.root['dialog_access_key_id']}"
secret_access_key = "#{$evm.root['dialog_secret_access_key']}"
image_id = "#{$evm.root['dialog_image_id']}"
instance_type = "#{$evm.root['dialog_instance_type']}"
count = "#{$evm.root['dialog_count']}"
availability_zone = "#{$evm.root['dialog_availability_zone']}"
security_groups = "#{$evm.root['dialog_security_groups']}"
key_name = "#{$evm.root['dialog_key_name']}"
order_id = "#{$evm.root['dialog_order_item']}"
instance_name = "#{$evm.root['dialog_instance_name']}"

# Configure AWS
AWS.config(
    :access_key_id => access_key_id,
    :secret_access_key => secret_access_key
)

# Create the new EC2 instance
ec2 = AWS::EC2.new

# Create the hash of options for the specified VM
options = {
    :image_id => image_id,
    :instance_type => instance_type,
    :count => count,
    :availability_zone => availability_zone,
    :security_groups => security_groups,
    :key_name => key_name
}

# Remove all empty strings from the options list
# to avoid error in creation of EC2 instance
options.each do |key, value|
  if value == "" || value == nil
    options.delete(key)
  end
end

$evm.log("info", "CreateEC2: Options: #{options}")

begin
  instance = ec2.instances.create(options)
rescue AWS::EC2::Errors::InvalidClientTokenId => e
  $evm.log("error", "CreateEC2: Invalid client token exception. Message: #{e.message}")
  send_order_status("CRITICAL", order_id, "","#{e.message}")
  exit
rescue AWS::EC2::Errors::InvalidParameterValue => e
  $evm.log("error", "CreateEC2: Invalid parameter exception. Message: #{e.message}")
  send_order_status("CRITICAL", order_id, "","#{e.message}")
  exit
rescue Exception => e
  $evm.log("error", "CreateEC2: Could not create instance. Error: #{e}")
  send_order_status("CRITICAL", order_id, "","#{e.message}")
  exit
end

# Amazon needs ~5 seconds before the instance can be accessed
# From the time it is initially created.
sleep 5
if instance.exists?
  while instance.status == :pending
    sleep 5
    send_order_status("PENDING", order_id, "")
  end
end

# Return all of the properties inside of a JSON Response
# But first just print them all out

info = {
    "order_item" => "#{order_id}",
    "architecture" => "#{instance.architecture}",
    "dns_name" => "#{instance.dns_name}",
    "id" => "#{instance.id}",
    "image_id" => "#{instance.image_id}",
    "instance_type" => "#{instance.instance_type}",
    "ip_address" =>  "#{instance.ip_address}",
    "key_name" => "#{instance.key_name}",
    "launch_time" => "#{instance.launch_time}",
    "owner_id" => "#{instance.owner_id}",
    "platform" => "#{instance.platform}",
    "private_ip_address" => "#{instance.private_ip_address}",
    "root_device_name" => "#{instance.root_device_name}",
    "root_device_type" => "#{instance.root_device_type}",
    "instance" => "#{instance.status}",
    "subnet_id" => "#{instance.subnet_id}",
    "virtualization_type" => "#{instance.virtualization_type}",
    "vpc_id" => "#{instance.vpc_id}"
}

end_order_status("OK", order_id, info)

$evm.log("info", "CreateEC2: Response =  #{response}")