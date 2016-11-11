using Funq;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Caching;
using ServiceStack.Configuration;
using ServiceStack.Data;
using ServiceStack.Host.Handlers;
using ServiceStack.Html;
using ServiceStack.IO;
using ServiceStack.OrmLite;
using ServiceStack.VirtualPath;
using System;
using System.Collections.Generic;
using System.Net;
using System.Linq;
using System.Text.RegularExpressions;
using ServiceStack.Api.Swagger;
using ServiceStack.Text;
using System.Diagnostics;
using System.IO;
using ServiceStack.Mvc;
using System.Reflection;
using WMWSS.Services;

namespace WMWSS.Code
{
  public class AppHost : AppHostBase
  {
    TimeSpan StaticCacheDuration = TimeSpan.FromDays(2);
    /// <summary>
    /// Default constructor.
    /// Base constructor requires a name and assembly to locate web service classes. 
    /// </summary>
    public AppHost()
      : base("Dummy", typeof(WebPagesService).GetTypeInfo().Assembly)
    {

    }


    public override void Configure(Container container)
    {
      ConfigureJson();
      ConfigureRazor();
      ConfigureHost(container);
    }

    private void ConfigureHost(Container container)
    {
      var hostConfig = new HostConfig
      {
        DebugMode = true,
        EnableFeatures = Feature.Html | Feature.Razor | Feature.Xml | Feature.Json | Feature.Metadata,
        DefaultRedirectPath = "/test",
        AllowFileExtensions = { { "eot" }, { "svg" }, { "ttf" }, { "woff" }, { "txt" }, { "gif" }, { "json" }, { "html" } },
        AddMaxAgeForStaticMimeTypes = new Dictionary<string, TimeSpan>{
          { "image/gif", StaticCacheDuration },
          { "image/png", StaticCacheDuration },
          { "image/jpeg", StaticCacheDuration },
          { "image/jpg", StaticCacheDuration },
          { "text/css", StaticCacheDuration },
          { "application/font-woff", StaticCacheDuration },

        },
        GlobalResponseHeaders = new Dictionary<string, string>(),
      };

      SetConfig(hostConfig);
    }



    private void ConfigureRazor()
    {

      Plugins.Add(new RazorFormat
      {

      });
    }

    private static void ConfigureJson()
    {
      JsConfig.EmitCamelCaseNames = true;
      JsConfig.IncludeNullValues = true;
      JsConfig.DateHandler = DateHandler.ISO8601;
    }



  }
}