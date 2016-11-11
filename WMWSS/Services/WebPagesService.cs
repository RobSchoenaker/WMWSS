using ServiceStack;


namespace WMWSS.Services
{

  [Route("/Test")]
  public class DefaultRequest : IReturn<DefaultResult>
  {

  }

  public class DefaultResult
  {

  }

  public class WebPagesService: Service
  {

    public object Any(DefaultRequest request)
    {

      Request.Items["View"] = "Default";
      return new DefaultResult
      {

      };



    }

  }
}
