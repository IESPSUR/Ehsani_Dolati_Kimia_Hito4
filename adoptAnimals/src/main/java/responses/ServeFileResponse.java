package responses;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;

import lombok.Data;
import springfox.documentation.schema.ModelReference;
import springfox.documentation.service.Header;
import springfox.documentation.service.ResponseMessage;
import springfox.documentation.service.VendorExtension;

@Data
public class ServeFileResponse extends ResponseMessage{

	public ServeFileResponse(int code, String message, ModelReference responseModel, Map<String, Header> headers,
			List<VendorExtension> vendorExtensions) {
		super(code, message, responseModel, headers, vendorExtensions);
		// TODO Auto-generated constructor stub
	}
	
	private List<Resource> list;
}
