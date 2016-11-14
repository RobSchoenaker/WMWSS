using ServiceStack;
using System;
using System.Diagnostics;

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

    [DefaultView("Default")]
    public object Any(DefaultRequest request)
    {

      return Request.ToOptimizedResultUsingCache(this.Cache, UrnId.CreateWithParts("15", "dummy"), TimeSpan.FromMilliseconds(20000), () =>
      {
        return new DefaultResult
        {

        };

      });


      



    }

  }
}
