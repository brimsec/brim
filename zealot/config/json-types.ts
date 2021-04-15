export function getDefaultJsonTypeConfig() {
  return {
    descriptors: {
      broker_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "ty",
          type: "zenum"
        },
        {
          name: "ev",
          type: "bstring"
        },
        {
          name: "peer",
          type: [
            {
              name: "address",
              type: "bstring"
            },
            {
              name: "bound_port",
              type: "port"
            }
          ]
        },
        {
          name: "message",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      capture_loss_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "ts_delta",
          type: "duration"
        },
        {
          name: "peer",
          type: "bstring"
        },
        {
          name: "gaps",
          type: "uint64"
        },
        {
          name: "acks",
          type: "uint64"
        },
        {
          name: "percent_lost",
          type: "float64"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      cluster_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "node",
          type: "bstring"
        },
        {
          name: "message",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      config_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "id",
          type: "bstring"
        },
        {
          name: "old_value",
          type: "bstring"
        },
        {
          name: "new_value",
          type: "bstring"
        },
        {
          name: "location",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      conn_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "proto",
          type: "zenum"
        },
        {
          name: "service",
          type: "bstring"
        },
        {
          name: "duration",
          type: "duration"
        },
        {
          name: "orig_bytes",
          type: "uint64"
        },
        {
          name: "resp_bytes",
          type: "uint64"
        },
        {
          name: "conn_state",
          type: "bstring"
        },
        {
          name: "local_orig",
          type: "bool"
        },
        {
          name: "local_resp",
          type: "bool"
        },
        {
          name: "missed_bytes",
          type: "uint64"
        },
        {
          name: "history",
          type: "bstring"
        },
        {
          name: "orig_pkts",
          type: "uint64"
        },
        {
          name: "orig_ip_bytes",
          type: "uint64"
        },
        {
          name: "resp_pkts",
          type: "uint64"
        },
        {
          name: "resp_ip_bytes",
          type: "uint64"
        },
        {
          name: "tunnel_parents",
          type: "set[bstring]"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      dce_rpc_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "rtt",
          type: "duration"
        },
        {
          name: "named_pipe",
          type: "bstring"
        },
        {
          name: "endpoint",
          type: "bstring"
        },
        {
          name: "operation",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      dhcp_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uids",
          type: "set[bstring]"
        },
        {
          name: "client_addr",
          type: "ip"
        },
        {
          name: "server_addr",
          type: "ip"
        },
        {
          name: "mac",
          type: "bstring"
        },
        {
          name: "host_name",
          type: "bstring"
        },
        {
          name: "client_fqdn",
          type: "bstring"
        },
        {
          name: "domain",
          type: "bstring"
        },
        {
          name: "requested_addr",
          type: "ip"
        },
        {
          name: "assigned_addr",
          type: "ip"
        },
        {
          name: "lease_time",
          type: "duration"
        },
        {
          name: "client_message",
          type: "bstring"
        },
        {
          name: "server_message",
          type: "bstring"
        },
        {
          name: "msg_types",
          type: "array[bstring]"
        },
        {
          name: "duration",
          type: "duration"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      dnp3_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "fc_request",
          type: "bstring"
        },
        {
          name: "fc_reply",
          type: "bstring"
        },
        {
          name: "iin",
          type: "uint64"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      dns_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "proto",
          type: "zenum"
        },
        {
          name: "trans_id",
          type: "uint64"
        },
        {
          name: "rtt",
          type: "duration"
        },
        {
          name: "query",
          type: "bstring"
        },
        {
          name: "qclass",
          type: "uint64"
        },
        {
          name: "qclass_name",
          type: "bstring"
        },
        {
          name: "qtype",
          type: "uint64"
        },
        {
          name: "qtype_name",
          type: "bstring"
        },
        {
          name: "rcode",
          type: "uint64"
        },
        {
          name: "rcode_name",
          type: "bstring"
        },
        {
          name: "AA",
          type: "bool"
        },
        {
          name: "TC",
          type: "bool"
        },
        {
          name: "RD",
          type: "bool"
        },
        {
          name: "RA",
          type: "bool"
        },
        {
          name: "Z",
          type: "uint64"
        },
        {
          name: "answers",
          type: "array[bstring]"
        },
        {
          name: "TTLs",
          type: "array[duration]"
        },
        {
          name: "rejected",
          type: "bool"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      dpd_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "proto",
          type: "zenum"
        },
        {
          name: "analyzer",
          type: "bstring"
        },
        {
          name: "failure_reason",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      files_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "fuid",
          type: "bstring"
        },
        {
          name: "tx_hosts",
          type: "set[ip]"
        },
        {
          name: "rx_hosts",
          type: "set[ip]"
        },
        {
          name: "conn_uids",
          type: "set[bstring]"
        },
        {
          name: "source",
          type: "bstring"
        },
        {
          name: "depth",
          type: "uint64"
        },
        {
          name: "analyzers",
          type: "set[bstring]"
        },
        {
          name: "mime_type",
          type: "bstring"
        },
        {
          name: "filename",
          type: "bstring"
        },
        {
          name: "duration",
          type: "duration"
        },
        {
          name: "local_orig",
          type: "bool"
        },
        {
          name: "is_orig",
          type: "bool"
        },
        {
          name: "seen_bytes",
          type: "uint64"
        },
        {
          name: "total_bytes",
          type: "uint64"
        },
        {
          name: "missing_bytes",
          type: "uint64"
        },
        {
          name: "overflow_bytes",
          type: "uint64"
        },
        {
          name: "timedout",
          type: "bool"
        },
        {
          name: "parent_fuid",
          type: "bstring"
        },
        {
          name: "md5",
          type: "bstring"
        },
        {
          name: "sha1",
          type: "bstring"
        },
        {
          name: "sha256",
          type: "bstring"
        },
        {
          name: "extracted",
          type: "bstring"
        },
        {
          name: "extracted_cutoff",
          type: "bool"
        },
        {
          name: "extracted_size",
          type: "uint64"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      ftp_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "user",
          type: "bstring"
        },
        {
          name: "password",
          type: "bstring"
        },
        {
          name: "command",
          type: "bstring"
        },
        {
          name: "arg",
          type: "bstring"
        },
        {
          name: "mime_type",
          type: "bstring"
        },
        {
          name: "file_size",
          type: "uint64"
        },
        {
          name: "reply_code",
          type: "uint64"
        },
        {
          name: "reply_msg",
          type: "bstring"
        },
        {
          name: "data_channel",
          type: [
            {
              name: "passive",
              type: "bool"
            },
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "fuid",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      http_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "trans_depth",
          type: "uint64"
        },
        {
          name: "method",
          type: "bstring"
        },
        {
          name: "host",
          type: "bstring"
        },
        {
          name: "uri",
          type: "bstring"
        },
        {
          name: "referrer",
          type: "bstring"
        },
        {
          name: "version",
          type: "bstring"
        },
        {
          name: "user_agent",
          type: "bstring"
        },
        {
          name: "origin",
          type: "bstring"
        },
        {
          name: "request_body_len",
          type: "uint64"
        },
        {
          name: "response_body_len",
          type: "uint64"
        },
        {
          name: "status_code",
          type: "uint64"
        },
        {
          name: "status_msg",
          type: "bstring"
        },
        {
          name: "info_code",
          type: "uint64"
        },
        {
          name: "info_msg",
          type: "bstring"
        },
        {
          name: "tags",
          type: "set[zenum]"
        },
        {
          name: "username",
          type: "bstring"
        },
        {
          name: "password",
          type: "bstring"
        },
        {
          name: "proxied",
          type: "set[bstring]"
        },
        {
          name: "orig_fuids",
          type: "array[bstring]"
        },
        {
          name: "orig_filenames",
          type: "array[bstring]"
        },
        {
          name: "orig_mime_types",
          type: "array[bstring]"
        },
        {
          name: "resp_fuids",
          type: "array[bstring]"
        },
        {
          name: "resp_filenames",
          type: "array[bstring]"
        },
        {
          name: "resp_mime_types",
          type: "array[bstring]"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      intel_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "seen",
          type: [
            {
              name: "indicator",
              type: "bstring"
            },
            {
              name: "indicator_type",
              type: "zenum"
            },
            {
              name: "where",
              type: "zenum"
            },
            {
              name: "node",
              type: "bstring"
            }
          ]
        },
        {
          name: "matched",
          type: "set[zenum]"
        },
        {
          name: "sources",
          type: "set[bstring]"
        },
        {
          name: "fuid",
          type: "bstring"
        },
        {
          name: "file_mime_type",
          type: "bstring"
        },
        {
          name: "file_desc",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      irc_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "nick",
          type: "bstring"
        },
        {
          name: "user",
          type: "bstring"
        },
        {
          name: "command",
          type: "bstring"
        },
        {
          name: "value",
          type: "bstring"
        },
        {
          name: "addl",
          type: "bstring"
        },
        {
          name: "dcc_file_name",
          type: "bstring"
        },
        {
          name: "dcc_file_size",
          type: "uint64"
        },
        {
          name: "dcc_mime_type",
          type: "bstring"
        },
        {
          name: "fuid",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      kerberos_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "request_type",
          type: "bstring"
        },
        {
          name: "client",
          type: "bstring"
        },
        {
          name: "service",
          type: "bstring"
        },
        {
          name: "success",
          type: "bool"
        },
        {
          name: "error_msg",
          type: "bstring"
        },
        {
          name: "from",
          type: "time"
        },
        {
          name: "till",
          type: "time"
        },
        {
          name: "cipher",
          type: "bstring"
        },
        {
          name: "forwardable",
          type: "bool"
        },
        {
          name: "renewable",
          type: "bool"
        },
        {
          name: "client_cert_subject",
          type: "bstring"
        },
        {
          name: "client_cert_fuid",
          type: "bstring"
        },
        {
          name: "server_cert_subject",
          type: "bstring"
        },
        {
          name: "server_cert_fuid",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      known_certs_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "host",
          type: "ip"
        },
        {
          name: "port_num",
          type: "port"
        },
        {
          name: "subject",
          type: "bstring"
        },
        {
          name: "issuer_subject",
          type: "bstring"
        },
        {
          name: "serial",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      known_hosts_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "host",
          type: "ip"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      known_services_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "host",
          type: "ip"
        },
        {
          name: "port_num",
          type: "port"
        },
        {
          name: "port_proto",
          type: "zenum"
        },
        {
          name: "service",
          type: "set[bstring]"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      loaded_scripts_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "name",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      modbus_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "func",
          type: "bstring"
        },
        {
          name: "exception",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      mysql_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "cmd",
          type: "bstring"
        },
        {
          name: "arg",
          type: "bstring"
        },
        {
          name: "success",
          type: "bool"
        },
        {
          name: "rows",
          type: "uint64"
        },
        {
          name: "response",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      netcontrol_drop_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "rule_id",
          type: "bstring"
        },
        {
          name: "orig_h",
          type: "ip"
        },
        {
          name: "orig_p",
          type: "port"
        },
        {
          name: "resp_h",
          type: "ip"
        },
        {
          name: "resp_p",
          type: "port"
        },
        {
          name: "expire",
          type: "duration"
        },
        {
          name: "location",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      netcontrol_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "rule_id",
          type: "bstring"
        },
        {
          name: "category",
          type: "zenum"
        },
        {
          name: "cmd",
          type: "bstring"
        },
        {
          name: "state",
          type: "zenum"
        },
        {
          name: "action",
          type: "bstring"
        },
        {
          name: "target",
          type: "zenum"
        },
        {
          name: "entity_type",
          type: "bstring"
        },
        {
          name: "entity",
          type: "bstring"
        },
        {
          name: "mod",
          type: "bstring"
        },
        {
          name: "msg",
          type: "bstring"
        },
        {
          name: "priority",
          type: "int64"
        },
        {
          name: "expire",
          type: "duration"
        },
        {
          name: "location",
          type: "bstring"
        },
        {
          name: "plugin",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      netcontrol_shunt_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "rule_id",
          type: "bstring"
        },
        {
          name: "f",
          type: [
            {
              name: "src_h",
              type: "ip"
            },
            {
              name: "src_p",
              type: "port"
            },
            {
              name: "dst_h",
              type: "ip"
            },
            {
              name: "dst_p",
              type: "port"
            }
          ]
        },
        {
          name: "expire",
          type: "duration"
        },
        {
          name: "location",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      notice_alarm_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "fuid",
          type: "bstring"
        },
        {
          name: "file_mime_type",
          type: "bstring"
        },
        {
          name: "file_desc",
          type: "bstring"
        },
        {
          name: "proto",
          type: "zenum"
        },
        {
          name: "note",
          type: "zenum"
        },
        {
          name: "msg",
          type: "bstring"
        },
        {
          name: "sub",
          type: "bstring"
        },
        {
          name: "src",
          type: "ip"
        },
        {
          name: "dst",
          type: "ip"
        },
        {
          name: "p",
          type: "port"
        },
        {
          name: "n",
          type: "uint64"
        },
        {
          name: "peer_descr",
          type: "bstring"
        },
        {
          name: "actions",
          type: "set[zenum]"
        },
        {
          name: "suppress_for",
          type: "duration"
        },
        {
          name: "remote_location",
          type: [
            {
              name: "country_code",
              type: "bstring"
            },
            {
              name: "region",
              type: "bstring"
            },
            {
              name: "city",
              type: "bstring"
            },
            {
              name: "latitude",
              type: "float64"
            },
            {
              name: "longitude",
              type: "float64"
            }
          ]
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      notice_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "fuid",
          type: "bstring"
        },
        {
          name: "file_mime_type",
          type: "bstring"
        },
        {
          name: "file_desc",
          type: "bstring"
        },
        {
          name: "proto",
          type: "zenum"
        },
        {
          name: "note",
          type: "zenum"
        },
        {
          name: "msg",
          type: "bstring"
        },
        {
          name: "sub",
          type: "bstring"
        },
        {
          name: "src",
          type: "ip"
        },
        {
          name: "dst",
          type: "ip"
        },
        {
          name: "p",
          type: "port"
        },
        {
          name: "n",
          type: "uint64"
        },
        {
          name: "peer_descr",
          type: "bstring"
        },
        {
          name: "actions",
          type: "set[zenum]"
        },
        {
          name: "suppress_for",
          type: "duration"
        },
        {
          name: "remote_location",
          type: [
            {
              name: "country_code",
              type: "bstring"
            },
            {
              name: "region",
              type: "bstring"
            },
            {
              name: "city",
              type: "bstring"
            },
            {
              name: "latitude",
              type: "float64"
            },
            {
              name: "longitude",
              type: "float64"
            }
          ]
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      ntlm_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "username",
          type: "bstring"
        },
        {
          name: "hostname",
          type: "bstring"
        },
        {
          name: "domainname",
          type: "bstring"
        },
        {
          name: "server_nb_computer_name",
          type: "bstring"
        },
        {
          name: "server_dns_computer_name",
          type: "bstring"
        },
        {
          name: "server_tree_name",
          type: "bstring"
        },
        {
          name: "success",
          type: "bool"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      ntp_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "version",
          type: "uint64"
        },
        {
          name: "mode",
          type: "uint64"
        },
        {
          name: "stratum",
          type: "uint64"
        },
        {
          name: "poll",
          type: "duration"
        },
        {
          name: "precision",
          type: "duration"
        },
        {
          name: "root_delay",
          type: "duration"
        },
        {
          name: "root_disp",
          type: "duration"
        },
        {
          name: "ref_id",
          type: "bstring"
        },
        {
          name: "ref_time",
          type: "time"
        },
        {
          name: "org_time",
          type: "time"
        },
        {
          name: "rec_time",
          type: "time"
        },
        {
          name: "xmt_time",
          type: "time"
        },
        {
          name: "num_exts",
          type: "uint64"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      packet_filter_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "node",
          type: "bstring"
        },
        {
          name: "filter",
          type: "bstring"
        },
        {
          name: "init",
          type: "bool"
        },
        {
          name: "success",
          type: "bool"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      pe_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "id",
          type: "bstring"
        },
        {
          name: "machine",
          type: "bstring"
        },
        {
          name: "compile_ts",
          type: "time"
        },
        {
          name: "os",
          type: "bstring"
        },
        {
          name: "subsystem",
          type: "bstring"
        },
        {
          name: "is_exe",
          type: "bool"
        },
        {
          name: "is_64bit",
          type: "bool"
        },
        {
          name: "uses_aslr",
          type: "bool"
        },
        {
          name: "uses_dep",
          type: "bool"
        },
        {
          name: "uses_code_integrity",
          type: "bool"
        },
        {
          name: "uses_seh",
          type: "bool"
        },
        {
          name: "has_import_table",
          type: "bool"
        },
        {
          name: "has_export_table",
          type: "bool"
        },
        {
          name: "has_cert_table",
          type: "bool"
        },
        {
          name: "has_debug_data",
          type: "bool"
        },
        {
          name: "section_names",
          type: "array[bstring]"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      radius_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "username",
          type: "bstring"
        },
        {
          name: "mac",
          type: "bstring"
        },
        {
          name: "framed_addr",
          type: "ip"
        },
        {
          name: "tunnel_client",
          type: "bstring"
        },
        {
          name: "connect_info",
          type: "bstring"
        },
        {
          name: "reply_msg",
          type: "bstring"
        },
        {
          name: "result",
          type: "bstring"
        },
        {
          name: "ttl",
          type: "duration"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      rdp_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "cookie",
          type: "bstring"
        },
        {
          name: "result",
          type: "bstring"
        },
        {
          name: "security_protocol",
          type: "bstring"
        },
        {
          name: "client_channels",
          type: "array[bstring]"
        },
        {
          name: "keyboard_layout",
          type: "bstring"
        },
        {
          name: "client_build",
          type: "bstring"
        },
        {
          name: "client_name",
          type: "bstring"
        },
        {
          name: "client_dig_product_id",
          type: "bstring"
        },
        {
          name: "desktop_width",
          type: "uint64"
        },
        {
          name: "desktop_height",
          type: "uint64"
        },
        {
          name: "requested_color_depth",
          type: "bstring"
        },
        {
          name: "cert_type",
          type: "bstring"
        },
        {
          name: "cert_count",
          type: "uint64"
        },
        {
          name: "cert_permanent",
          type: "bool"
        },
        {
          name: "encryption_level",
          type: "bstring"
        },
        {
          name: "encryption_method",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      reporter_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "level",
          type: "zenum"
        },
        {
          name: "message",
          type: "bstring"
        },
        {
          name: "location",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      rfb_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "client_major_version",
          type: "bstring"
        },
        {
          name: "client_minor_version",
          type: "bstring"
        },
        {
          name: "server_major_version",
          type: "bstring"
        },
        {
          name: "server_minor_version",
          type: "bstring"
        },
        {
          name: "authentication_method",
          type: "bstring"
        },
        {
          name: "auth",
          type: "bool"
        },
        {
          name: "share_flag",
          type: "bool"
        },
        {
          name: "desktop_name",
          type: "bstring"
        },
        {
          name: "width",
          type: "uint64"
        },
        {
          name: "height",
          type: "uint64"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      signatures_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "src_addr",
          type: "ip"
        },
        {
          name: "src_port",
          type: "port"
        },
        {
          name: "dst_addr",
          type: "ip"
        },
        {
          name: "dst_port",
          type: "port"
        },
        {
          name: "note",
          type: "zenum"
        },
        {
          name: "sig_id",
          type: "bstring"
        },
        {
          name: "event_msg",
          type: "bstring"
        },
        {
          name: "sub_msg",
          type: "bstring"
        },
        {
          name: "sig_count",
          type: "uint64"
        },
        {
          name: "host_count",
          type: "uint64"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      sip_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "trans_depth",
          type: "uint64"
        },
        {
          name: "method",
          type: "bstring"
        },
        {
          name: "uri",
          type: "bstring"
        },
        {
          name: "date",
          type: "bstring"
        },
        {
          name: "request_from",
          type: "bstring"
        },
        {
          name: "request_to",
          type: "bstring"
        },
        {
          name: "response_from",
          type: "bstring"
        },
        {
          name: "response_to",
          type: "bstring"
        },
        {
          name: "reply_to",
          type: "bstring"
        },
        {
          name: "call_id",
          type: "bstring"
        },
        {
          name: "seq",
          type: "bstring"
        },
        {
          name: "subject",
          type: "bstring"
        },
        {
          name: "request_path",
          type: "array[bstring]"
        },
        {
          name: "response_path",
          type: "array[bstring]"
        },
        {
          name: "user_agent",
          type: "bstring"
        },
        {
          name: "status_code",
          type: "uint64"
        },
        {
          name: "status_msg",
          type: "bstring"
        },
        {
          name: "warning",
          type: "bstring"
        },
        {
          name: "request_body_len",
          type: "uint64"
        },
        {
          name: "response_body_len",
          type: "uint64"
        },
        {
          name: "content_type",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      smb_files_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "fuid",
          type: "bstring"
        },
        {
          name: "action",
          type: "zenum"
        },
        {
          name: "path",
          type: "bstring"
        },
        {
          name: "name",
          type: "bstring"
        },
        {
          name: "size",
          type: "uint64"
        },
        {
          name: "prev_name",
          type: "bstring"
        },
        {
          name: "times",
          type: [
            {
              name: "modified",
              type: "time"
            },
            {
              name: "accessed",
              type: "time"
            },
            {
              name: "created",
              type: "time"
            },
            {
              name: "changed",
              type: "time"
            }
          ]
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      smb_mapping_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "path",
          type: "bstring"
        },
        {
          name: "service",
          type: "bstring"
        },
        {
          name: "native_file_system",
          type: "bstring"
        },
        {
          name: "share_type",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      smtp_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "trans_depth",
          type: "uint64"
        },
        {
          name: "helo",
          type: "bstring"
        },
        {
          name: "mailfrom",
          type: "bstring"
        },
        {
          name: "rcptto",
          type: "set[bstring]"
        },
        {
          name: "date",
          type: "bstring"
        },
        {
          name: "from",
          type: "bstring"
        },
        {
          name: "to",
          type: "set[bstring]"
        },
        {
          name: "cc",
          type: "set[bstring]"
        },
        {
          name: "reply_to",
          type: "bstring"
        },
        {
          name: "msg_id",
          type: "bstring"
        },
        {
          name: "in_reply_to",
          type: "bstring"
        },
        {
          name: "subject",
          type: "bstring"
        },
        {
          name: "x_originating_ip",
          type: "ip"
        },
        {
          name: "first_received",
          type: "bstring"
        },
        {
          name: "second_received",
          type: "bstring"
        },
        {
          name: "last_reply",
          type: "bstring"
        },
        {
          name: "path",
          type: "array[ip]"
        },
        {
          name: "user_agent",
          type: "bstring"
        },
        {
          name: "tls",
          type: "bool"
        },
        {
          name: "fuids",
          type: "array[bstring]"
        },
        {
          name: "is_webmail",
          type: "bool"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      snmp_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "duration",
          type: "duration"
        },
        {
          name: "version",
          type: "bstring"
        },
        {
          name: "community",
          type: "bstring"
        },
        {
          name: "get_requests",
          type: "uint64"
        },
        {
          name: "get_bulk_requests",
          type: "uint64"
        },
        {
          name: "get_responses",
          type: "uint64"
        },
        {
          name: "set_requests",
          type: "uint64"
        },
        {
          name: "display_string",
          type: "bstring"
        },
        {
          name: "up_since",
          type: "time"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      socks_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "version",
          type: "uint64"
        },
        {
          name: "user",
          type: "bstring"
        },
        {
          name: "password",
          type: "bstring"
        },
        {
          name: "status",
          type: "bstring"
        },
        {
          name: "request",
          type: [
            {
              name: "host",
              type: "ip"
            },
            {
              name: "name",
              type: "bstring"
            }
          ]
        },
        {
          name: "request_p",
          type: "port"
        },
        {
          name: "bound",
          type: [
            {
              name: "host",
              type: "ip"
            },
            {
              name: "name",
              type: "bstring"
            }
          ]
        },
        {
          name: "bound_p",
          type: "port"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      software_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "host",
          type: "ip"
        },
        {
          name: "host_p",
          type: "port"
        },
        {
          name: "software_type",
          type: "zenum"
        },
        {
          name: "name",
          type: "bstring"
        },
        {
          name: "version",
          type: [
            {
              name: "major",
              type: "uint64"
            },
            {
              name: "minor",
              type: "uint64"
            },
            {
              name: "minor2",
              type: "uint64"
            },
            {
              name: "minor3",
              type: "uint64"
            },
            {
              name: "addl",
              type: "bstring"
            }
          ]
        },
        {
          name: "unparsed_version",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      ssh_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "version",
          type: "uint64"
        },
        {
          name: "auth_success",
          type: "bool"
        },
        {
          name: "auth_attempts",
          type: "uint64"
        },
        {
          name: "direction",
          type: "zenum"
        },
        {
          name: "client",
          type: "bstring"
        },
        {
          name: "server",
          type: "bstring"
        },
        {
          name: "cipher_alg",
          type: "bstring"
        },
        {
          name: "mac_alg",
          type: "bstring"
        },
        {
          name: "compression_alg",
          type: "bstring"
        },
        {
          name: "kex_alg",
          type: "bstring"
        },
        {
          name: "host_key_alg",
          type: "bstring"
        },
        {
          name: "host_key",
          type: "bstring"
        },
        {
          name: "remote_location",
          type: [
            {
              name: "country_code",
              type: "bstring"
            },
            {
              name: "region",
              type: "bstring"
            },
            {
              name: "city",
              type: "bstring"
            },
            {
              name: "latitude",
              type: "float64"
            },
            {
              name: "longitude",
              type: "float64"
            }
          ]
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      ssl_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "version",
          type: "bstring"
        },
        {
          name: "cipher",
          type: "bstring"
        },
        {
          name: "curve",
          type: "bstring"
        },
        {
          name: "server_name",
          type: "bstring"
        },
        {
          name: "resumed",
          type: "bool"
        },
        {
          name: "last_alert",
          type: "bstring"
        },
        {
          name: "next_protocol",
          type: "bstring"
        },
        {
          name: "established",
          type: "bool"
        },
        {
          name: "cert_chain_fuids",
          type: "array[bstring]"
        },
        {
          name: "client_cert_chain_fuids",
          type: "array[bstring]"
        },
        {
          name: "subject",
          type: "bstring"
        },
        {
          name: "issuer",
          type: "bstring"
        },
        {
          name: "client_subject",
          type: "bstring"
        },
        {
          name: "client_issuer",
          type: "bstring"
        },
        {
          name: "validation_status",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      stats_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "peer",
          type: "bstring"
        },
        {
          name: "mem",
          type: "uint64"
        },
        {
          name: "pkts_proc",
          type: "uint64"
        },
        {
          name: "bytes_recv",
          type: "uint64"
        },
        {
          name: "pkts_dropped",
          type: "uint64"
        },
        {
          name: "pkts_link",
          type: "uint64"
        },
        {
          name: "pkt_lag",
          type: "duration"
        },
        {
          name: "events_proc",
          type: "uint64"
        },
        {
          name: "events_queued",
          type: "uint64"
        },
        {
          name: "active_tcp_conns",
          type: "uint64"
        },
        {
          name: "active_udp_conns",
          type: "uint64"
        },
        {
          name: "active_icmp_conns",
          type: "uint64"
        },
        {
          name: "tcp_conns",
          type: "uint64"
        },
        {
          name: "udp_conns",
          type: "uint64"
        },
        {
          name: "icmp_conns",
          type: "uint64"
        },
        {
          name: "timers",
          type: "uint64"
        },
        {
          name: "active_timers",
          type: "uint64"
        },
        {
          name: "files",
          type: "uint64"
        },
        {
          name: "active_files",
          type: "uint64"
        },
        {
          name: "dns_requests",
          type: "uint64"
        },
        {
          name: "active_dns_requests",
          type: "uint64"
        },
        {
          name: "reassem_tcp_size",
          type: "uint64"
        },
        {
          name: "reassem_file_size",
          type: "uint64"
        },
        {
          name: "reassem_frag_size",
          type: "uint64"
        },
        {
          name: "reassem_unknown_size",
          type: "uint64"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      syslog_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "proto",
          type: "zenum"
        },
        {
          name: "facility",
          type: "bstring"
        },
        {
          name: "severity",
          type: "bstring"
        },
        {
          name: "message",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      tunnel_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "tunnel_type",
          type: "zenum"
        },
        {
          name: "action",
          type: "zenum"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      weird_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "uid",
          type: "bstring"
        },
        {
          name: "id",
          type: [
            {
              name: "orig_h",
              type: "ip"
            },
            {
              name: "orig_p",
              type: "port"
            },
            {
              name: "resp_h",
              type: "ip"
            },
            {
              name: "resp_p",
              type: "port"
            }
          ]
        },
        {
          name: "name",
          type: "bstring"
        },
        {
          name: "addl",
          type: "bstring"
        },
        {
          name: "notice",
          type: "bool"
        },
        {
          name: "peer",
          type: "bstring"
        },
        {
          name: "source",
          type: "bstring"
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ],
      x509_log: [
        {
          name: "_path",
          type: "string"
        },
        {
          name: "ts",
          type: "time"
        },
        {
          name: "id",
          type: "bstring"
        },
        {
          name: "certificate",
          type: [
            {
              name: "version",
              type: "uint64"
            },
            {
              name: "serial",
              type: "bstring"
            },
            {
              name: "subject",
              type: "bstring"
            },
            {
              name: "issuer",
              type: "bstring"
            },
            {
              name: "not_valid_before",
              type: "time"
            },
            {
              name: "not_valid_after",
              type: "time"
            },
            {
              name: "key_alg",
              type: "bstring"
            },
            {
              name: "sig_alg",
              type: "bstring"
            },
            {
              name: "key_type",
              type: "bstring"
            },
            {
              name: "key_length",
              type: "uint64"
            },
            {
              name: "exponent",
              type: "bstring"
            },
            {
              name: "curve",
              type: "bstring"
            }
          ]
        },
        {
          name: "san",
          type: [
            {
              name: "dns",
              type: "array[bstring]"
            },
            {
              name: "uri",
              type: "array[bstring]"
            },
            {
              name: "email",
              type: "array[bstring]"
            },
            {
              name: "ip",
              type: "array[ip]"
            }
          ]
        },
        {
          name: "basic_constraints",
          type: [
            {
              name: "ca",
              type: "bool"
            },
            {
              name: "path_len",
              type: "uint64"
            }
          ]
        },
        {
          name: "_write_ts",
          type: "time"
        }
      ]
    },
    rules: [
      {
        descriptor: "broker_log",
        name: "_path",
        value: "broker"
      },
      {
        descriptor: "capture_loss_log",
        name: "_path",
        value: "capture_loss"
      },
      {
        descriptor: "cluster_log",
        name: "_path",
        value: "cluster"
      },
      {
        descriptor: "config_log",
        name: "_path",
        value: "config"
      },
      {
        descriptor: "conn_log",
        name: "_path",
        value: "conn"
      },
      {
        descriptor: "dce_rpc_log",
        name: "_path",
        value: "dce_rpc"
      },
      {
        descriptor: "dhcp_log",
        name: "_path",
        value: "dhcp"
      },
      {
        descriptor: "dnp3_log",
        name: "_path",
        value: "dnp3"
      },
      {
        descriptor: "dns_log",
        name: "_path",
        value: "dns"
      },
      {
        descriptor: "dpd_log",
        name: "_path",
        value: "dpd"
      },
      {
        descriptor: "files_log",
        name: "_path",
        value: "files"
      },
      {
        descriptor: "ftp_log",
        name: "_path",
        value: "ftp"
      },
      {
        descriptor: "http_log",
        name: "_path",
        value: "http"
      },
      {
        descriptor: "intel_log",
        name: "_path",
        value: "intel"
      },
      {
        descriptor: "irc_log",
        name: "_path",
        value: "irc"
      },
      {
        descriptor: "kerberos_log",
        name: "_path",
        value: "kerberos"
      },
      {
        descriptor: "known_certs_log",
        name: "_path",
        value: "known_certs"
      },
      {
        descriptor: "known_hosts_log",
        name: "_path",
        value: "known_hosts"
      },
      {
        descriptor: "known_services_log",
        name: "_path",
        value: "known_services"
      },
      {
        descriptor: "loaded_scripts_log",
        name: "_path",
        value: "loaded_scripts"
      },
      {
        descriptor: "modbus_log",
        name: "_path",
        value: "modbus"
      },
      {
        descriptor: "mysql_log",
        name: "_path",
        value: "mysql"
      },
      {
        descriptor: "netcontrol_log",
        name: "_path",
        value: "netcontrol"
      },
      {
        descriptor: "netcontrol_drop_log",
        name: "_path",
        value: "netcontrol_drop"
      },
      {
        descriptor: "netcontrol_shunt_log",
        name: "_path",
        value: "netcontrol_shunt"
      },
      {
        descriptor: "notice_log",
        name: "_path",
        value: "notice"
      },
      {
        descriptor: "notice_alarm_log",
        name: "_path",
        value: "notice_alarm"
      },
      {
        descriptor: "ntlm_log",
        name: "_path",
        value: "ntlm"
      },
      {
        descriptor: "ntp_log",
        name: "_path",
        value: "ntp"
      },
      {
        descriptor: "packet_filter_log",
        name: "_path",
        value: "packet_filter"
      },
      {
        descriptor: "pe_log",
        name: "_path",
        value: "pe"
      },
      {
        descriptor: "radius_log",
        name: "_path",
        value: "radius"
      },
      {
        descriptor: "rdp_log",
        name: "_path",
        value: "rdp"
      },
      {
        descriptor: "reporter_log",
        name: "_path",
        value: "reporter"
      },
      {
        descriptor: "rfb_log",
        name: "_path",
        value: "rfb"
      },
      {
        descriptor: "signatures_log",
        name: "_path",
        value: "signatures"
      },
      {
        descriptor: "sip_log",
        name: "_path",
        value: "sip"
      },
      {
        descriptor: "smb_files_log",
        name: "_path",
        value: "smb_files"
      },
      {
        descriptor: "smb_mapping_log",
        name: "_path",
        value: "smb_mapping"
      },
      {
        descriptor: "smtp_log",
        name: "_path",
        value: "smtp"
      },
      {
        descriptor: "snmp_log",
        name: "_path",
        value: "snmp"
      },
      {
        descriptor: "socks_log",
        name: "_path",
        value: "socks"
      },
      {
        descriptor: "software_log",
        name: "_path",
        value: "software"
      },
      {
        descriptor: "ssh_log",
        name: "_path",
        value: "ssh"
      },
      {
        descriptor: "ssl_log",
        name: "_path",
        value: "ssl"
      },
      {
        descriptor: "stats_log",
        name: "_path",
        value: "stats"
      },
      {
        descriptor: "syslog_log",
        name: "_path",
        value: "syslog"
      },
      {
        descriptor: "tunnel_log",
        name: "_path",
        value: "tunnel"
      },
      {
        descriptor: "weird_log",
        name: "_path",
        value: "weird"
      },
      {
        descriptor: "x509_log",
        name: "_path",
        value: "x509"
      }
    ]
  }
}
